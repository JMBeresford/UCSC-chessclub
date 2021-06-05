const customchessboard = Vue.component('customchessboard', {
  props: {
    game: Object,
    players: Object,
    user: Object,
    free: Boolean,
  },
  data() {
    return {
      toMove: String,
      fen: String,
      check: String,
      playerColor: String,
      ws: WebSocket,
    };
  },
  beforeDestroyed: function (){ this.ws.close},
  computed: {},
  methods: {
    isSpectator: function () {
      if (this.players.black.id == this.user.id) {
        return false;
      }

      if (this.players.white.id == this.user.id) {
        return false;
      }

      return true;
    },
    canMove: function () {
      if (this.free) {
        return true;
      }

      return this.toMove === this.playerColor && !this.isSpectator();
    },
    pushFen: function () {
      let payload = { fen: this.fen, game: this.game.id };
      axios
        .post('../post/game', payload)
        .then((res) => {
          let message = JSON.stringify({ type: 'move', id: this.game.id });
          this.ws.send(message);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    pullFen: function (e) {
      let message = JSON.parse(e.data);
      if (message.type != 'move' || message.id != this.game.id) {
        return false;
      }

      axios
        .get(`../get/fen?id=${this.game.id}`)
        .then((res) => {
          if (res.status == 200) {
            this.fen = res.data;
            this.$refs.chess.game.load(this.fen);
            this.$refs.chess.board.set({
              fen: this.fen,
              turnColor: this.$refs.chess.toColor(),
              movable: {
                color: this.$refs.chess.toColor(),
                dests: this.$refs.chess.possibleMoves(),
                events: { after: this.$refs.chess.changeTurn() },
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleMove: function (data) {
      console.log(this.$refs.chess.game.in_checkmate());
      this.toMove = data.turn;
      if (!this.free && data.fen != this.fen) {
        this.fen = data.fen;
        this.pushFen();
        if(this.$refs.chess.game.in_checkmate() )
        {
          let white_user = this.players.white.id;
          let black_user = this.players.black.id;
          let winner;
          axios
          .all([
            axios.get('../get/elo?id=' + white_user),
            axios.get('../get/elo?id=' + black_user),

          ])
          .then((responseArr) => {
            let eloHistoryPlayerWhite = [];
            let eloHistoryPlayerBlack= [];
            Object.values(responseArr[0].data).forEach((key) => {
                eloHistoryPlayerWhite.push({
                  date: key.updated_on,
                  elo:  key.rating,
                });
              });
              Object.values(responseArr[0].data).forEach((key) => {
                eloHistoryPlayerWhite.push({
                  date: key.updated_on,
                  elo:  key.rating,
                });
              });
              eloHistoryPlayerWhite.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
              });
              eloHistoryPlayerBlack.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
              });
              let mostUptoDateEloWhite = eloHistoryPlayerWhite[0].elo;
              let mostUptoDateEloBlack = eloHistoryPlayerBlack[0].elo;
              let newEloforBlack = 0;
              let newEloforWhite = 0;
              if(this.$refs.chess.board.state.turnColor == "white" )
              {
                winner = black_user;
                var eloProbWhite = 1.0 * 1.0 / (1 + 1.0 * 
                pow(10, 1.0 * (mostUptoDateEloWhite - mostUptoDateEloBlack) / 400));
                var eloProbBlack = 1.0 * 1.0 / (1 + 1.0 * 
                  pow(10, 1.0 * (mostUptoDateEloBlack- mostUptoDateEloWhite) / 400));
               // var newEloforBlack;
                newEloforBlack = mostUptoDateEloBlack + 30 * (1 - eloProbWhite);
               // var newEloforWhite;
                newEloforWhite = mostUptoDateEloWhite + 30 * (0 - eloProbBlack);
              }
              else{
                winner = white_user;
                var eloProbWhite = 1.0 * 1.0 / (1 + 1.0 * 
                  pow(10, 1.0 * (mostUptoDateEloWhite - mostUptoDateEloBlack) / 400));
                  var eloProbBlack = 1.0 * 1.0 / (1 + 1.0 * 
                    pow(10, 1.0 * (mostUptoDateEloBlack- mostUptoDateEloWhite) / 400));

                 // var newEloforWhite;
                  newEloforWhite = mostUptoDateEloWhite + 30 * (1 - eloProbBlack);
                 // var newEloforBlack;
                  newEloforBlack = mostUptoDateEloBlack + 30 * (0 - eloProbWhite);
               }

         axios.post('../post/gameover', {
              game_id: this.game.id,
              white_rating: newEloforWhite,
              black_Rating:newEloforBlack,
              winner_id: winner,
           })
          .then(function (response) {
            console.log("Response Doesn't matter, maybe status code?");
          });

          });
        }
        if (this.$refs.chess.game.in_check()) {
          let message = JSON.stringify({
            type: 'system',
            game_id: this.game.id,
            msg: `${this.toMove} is in check`,
          });
          this.ws.send(message);
        } else {
          this.check = '';
        }
      
      }
      this.$refs.chess.board.state.viewOnly = !this.canMove();
    },
    wsOpened: function (e) {
      console.log('game websocket connection established');
    //  return false;
    },
    wsClosed: function (e) {
      console.log('game websocket connection closed');
     // return false;
    },
  },
  created: function () {
    if (!this.free && !window.WebSocket) {
      if (window.MozWebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
    }

    if (!this.free) {
      this.ws = new WebSocket(
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
          window.location.host +
          `/chessclub/websocket/${this.game.id}`
      );

      this.ws.onopen = this.wsOpened;
      this.ws.onclose = this.wsClosed;
      this.ws.onmessage = this.pullFen;
      this.ws.onerror = (err) => {console.log(err)};
    }

    this.playerColor = 'white';

    if (!this.free && this.players.black.id == this.user.id) {
      this.playerColor = 'black';
    }

    if (!this.free) {
      this.fen = this.game.fen;
    } else {
      this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
  },
  mounted: function () {
    if (window) {
      window.addEventListener('resize', function () {
        document.body.dispatchEvent(new Event('chessground.resize'));
      });
    }

    this.$refs.chess.board.state.viewOnly = !this.canMove();
    document.body.dispatchEvent(new Event('chessground.resize'));
  },
  template: `
    <div id="custom-board">
      <h1 v-if="toMove">{{toMove}} to move</h1>
      <h1 v-else>Game Over</h1>
      <div class="wrapper">
        <chessboard
          ref="chess"
          @onMove="handleMove"
          :orientation="playerColor"
          :fen="fen"
        ></chessboard>
      </div>
      <!-- the inner component has ref="board" -->
    </div>
  `,
});

export default customchessboard;
