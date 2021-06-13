const leaderboards = Vue.component('leaderboards', {
  props: {
    players: Array,
    gamedata: String,
    elodata: String,
    user: Object,
  },
  data: function () {
    return {
      games: Object,
      elos: Object,
      allScores: [],
    };
  },
  computed: {
    sortedList: function () {
      return this.allScores.slice().sort(function (a, b) {
        return b.elo - a.elo;
      });
    },
  },
  methods: {
    canChallenge: function (id) {
      if (this.user.id === id) {
        return false;
      }

      for (let game of Object.values(this.games)) {
        if (game.winner !== null && (game.player_white === id || game.player_black === id)) {
          return false;
        }
      }

      return true;
    },
    calcWins: function (id) {
      let wins = 0;
      let losses = 0;
      let draws = 0;
      Object.keys(this.games).forEach((key) => {
        //only count wins, losses, draws if the player was involved in the game.
        if (
          this.games[key].winner !== null && (
          this.games[key].player_white == id ||
          this.games[key].player_black == id)
        ) {
          this.games[key].winner === id
            ? wins++
            : this.games[key].winner === 0
            ? draws++
            : losses++;
        }
      });
      return [wins, losses, draws];
    },

    populatePlayers: function () {
      console.log(this.elos);
      //use a set to remove duplicats when calculating all users. Need to determine if this is OK when debugging.
      let myUniquePlayers = new Set();
      Object.keys(this.elos).forEach((key) => {
        myUniquePlayers.add(this.elos[key].player_id);
      });
      myUniquePlayers = Array.from(myUniquePlayers);
      for (var i = 0; i < myUniquePlayers.length; i++) {
        //id to get metadata of, from elos table, ie, only rank a player if they have a default elo value.
        let id = myUniquePlayers[i];
        let userName = '';
        let that = this;
        let obj;
        axios
          .all([
            axios.get('../get/user?id=' + id),
            axios.get('../get/elo?id=' + id),
            axios.get('../get/pfp?id=' + id),
          ])
          .then((responseArr) => {
            //this will be executed only when all requests are complete
            let arrWinsLossDraws = this.calcWins(id);
            let winsID = arrWinsLossDraws[0];
            let losessID = arrWinsLossDraws[1];
            let drawsID = arrWinsLossDraws[2];
            let elo = 0;

            let eloHistoryPlayerWhite = [];
            Object.values(responseArr[1].data).forEach((key) => {
              eloHistoryPlayerWhite.push({
                date: key.updated_on,
                elo: key.rating,
              });
            });

            eloHistoryPlayerWhite.sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            });
            this.allScores.push({
              id: id,
              name: Object.values(responseArr[0].data)[0].username,
              elo: eloHistoryPlayerWhite[0].elo,
              pfp: responseArr[2].data,
              wins: winsID,
              losses: losessID,
              draws: drawsID,
              winrate: this.getWinrate(winsID, losessID, drawsID).toFixed(0),
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    goToProfile: function (id) {
      if (window) {
        window.location = `../profile/${id}/`;
      }
    },
    getWinrate: function (wins, losses, draws) {
      if (wins + losses + draws === 0) {
        return 0;
      }
      return (
        (parseInt(wins) * 100) /
        (parseInt(wins) + parseInt(losses) + parseInt(draws))
      );
    },
    challenge: function (id) {
      let player1;
      let player2;
      if (Math.random() > 0.5) {
        player1 = id;
        player2 = this.user.id;
      } else {
        player1 = this.user.id;
        player2 = id;
      }
      
      axios
        .post(`../post/newgame`, {
          player_white: player1,
          player_black: player2,
        })
        .then(function (response) {
          console.log(response.data);
          let str1 = 'game/';
          let str2 = str1.concat(response.data.game_id);
          str1 = window.location.href;
          str1 = str1.replace('leaderboards', str2);
          window.location.href = str1;
          //console.log(window.location.href);
          //window.location.replace(str2);
        });
    },
  },
  created: function () {
    this.games = JSON.parse(this.gamedata);
    this.elos = JSON.parse(this.elodata);
    this.populatePlayers();
  },
  template: `
    <div id="leaderboard-container">
    <div class="banner">
      <div class="innerWrap">
        <img src="svg/pieces/bp.svg">
        <h1>Leaderboards</h1>
        <img src="svg/pieces/wp.svg">
      </div>
    </div>
      <div class="wrap">
        <table>
          <thead>
            <th style="padding-left: 2rem;">Rank</th>
            <th colspan="2">User</th>
            <th>Elo</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Win Rate</th>
          </thead>
          <tbody>
            <tr v-for="(entry, i) in sortedList" :key="entry.id">
              <td style="padding-left: 2rem;">
                <div class="td rank">
                  <p>{{ ++i }}</p>
                </div>
              </td>
              <td colspan="2">
                <div @click='goToProfile(entry.id)' class="td user">
                  <div class="imgwrap">
                    <img class="pfp" :src="'img/pfp/' + entry.pfp">
                  </div>
                  <p>{{ entry.name }}</p>
                </div>
              </td>
              <td>
                <div class="td">
                <p>{{ entry.elo }}</p>
                </div>
              </td>
              <td>
                <div class="td">

                <p>{{ entry.wins }}</p>
                </div>
              </td>
              <td>
                <div class="td">
                <p>{{ entry.losses }}</p>
                </div>
              </td>
              <td>
                <div class="td">
                <p>{{ entry.draws }}</p>
                </div>
              </td>
              <td>
                <div class="td">
                <p>{{ entry.winrate }}%</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
     `,
});

export default leaderboards;
