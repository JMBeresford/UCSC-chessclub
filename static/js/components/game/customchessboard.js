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
      fen_es: EventSource,
    };
  },
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
    handleNewFen: function (e) {
      let data = JSON.parse(e.data);

      this.fen = data.fen;
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
    },
    handleMove: function (data) {
      this.toMove = data.turn;
      if (!this.free && data.fen != this.fen) {
        this.fen = data.fen;
        this.pushFen();
      }

      if (this.$refs.chess.game.in_check()) {
        let message = JSON.stringify({ type: 'check', color: this.toMove });
        this.ws.send(message);
      } else {
        this.check = '';
      }

      this.$refs.chess.board.state.viewOnly = !this.canMove();
    },
    esError: function (err) {
      console.error('EventSource failed:', err);
    },
  },
  beforeDestroy: function () {
    this.fen_es.close();
  },
  created: function () {
    this.playerColor = 'white';

    if (!this.free && this.players.black.id == this.user.id) {
      this.playerColor = 'black';
    }

    if (!this.free) {
      this.fen = this.game.fen;
    } else {
      this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    if (!this.free && !window.WebSocket) {
      if (window.MozWebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
    }

    if (!this.free) {
      this.fen_es = new EventSource(
        `${window.location.protocol}//${window.location.host}/chessclub/fen_sse/${this.game.id}`,
        {
          withCredentials: true,
        }
      );

      this.fen_es.onmessage = this.handleNewFen;
      this.fen_es.onerror = this.esError;
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
      <h1>{{toMove}} to move</h1>
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
