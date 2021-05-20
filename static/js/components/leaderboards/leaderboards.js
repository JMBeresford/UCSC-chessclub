const leaderboards = Vue.component('leaderboards', {
  props: {
    players: Array,
    gamedata: String,
    elodata: String,
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
    calcWins: function (id) {
      let wins = 0;
      let losses = 0;
      let draws = 0;
      Object.keys(this.games).forEach((key) => {
        //only count wins, losses, draws if the player was involved in the game.
        if (
          this.games[key].player_white == id ||
          this.games[key].player_black == id
        ) {
          this.games[key].winner === id
            ? wins++
            : this.games[key].winner === 0
            ? draws++
            : losses++;
        } else {
          console.log('Not counting');
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
            this.allScores.push({
              id: id,
              name: Object.values(responseArr[0].data)[0].username,
              elo: Object.values(responseArr[1].data)[0].rating,
              pfp: responseArr[2].data,
              wins: winsID,
              losses: losessID,
              draws: drawsID,
              winrate: this.getWinrate(winsID, losessID, drawsID).toFixed(0),
            });
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
      console.log('Challenge', id);
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
            <th>Rank</th>
            <th>User</th>
            <th>Elo</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Win Rate</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="(entry, i) in sortedList" :key="i">
              <td>
                <div class="td rank">
                  <p>{{ ++i }}</p>
                </div>
              </td>
              <td>
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
              <td>
                <div class="td buttontd">
                  <button class="btn" @click="challenge(entry.id)">
                    Challenge
                  </button>
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
