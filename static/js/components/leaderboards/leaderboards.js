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
    };
  },
  methods: {
    getWinrate: function (wins, losses, draws) {
      return (
        (parseInt(wins) * 100) /
        (parseInt(wins) + parseInt(losses) + parseInt(draws)).toFixed(0)
      );
    },
    challenge: function (id) {
      console.log('Challenge', id);
    },
  },
  beforeMount() {
    this.games = JSON.parse(this.gamedata);
    this.elos = JSON.parse(this.elodata);
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
            <tr v-for="(entry, i) in players" :key="i">
              <td>
                <div class="td rank">
                  <p>{{ ++i }}</p>
                </div> 
              </td>
              <td>
                <div class="td">
                  <p>Name</p>
                </div>  
              </td>
              <td>
                <div class="td">
                  <p>rating</p>
                </div>  
              </td>
              <td>
                <div class="td">
                  <p>wins</p>
                </div>  
              </td>
              <td>
                <div class="td">
                  <p>losses</p>
                </div>  
              </td>
              <td>
                <div class="td">
                  <p>draws</p>
                </div>  
              </td>
              <td>
                <div class="td">
                  <p>winrate%</p>
                </div>  
              </td>
              <td>
                <div class="td buttontd">
                  <button class="btn" @click="Challenge(entry.id)">
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
