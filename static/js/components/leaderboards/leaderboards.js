const leaderboards = Vue.component('leaderboards', {
  props: {
    players: Array,
    gamedata: String,
  },
  data: function () {
    return {
      games: Object,
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
            <th></th> <!-- For button -->
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </div>


     `,
});

export default leaderboards;
