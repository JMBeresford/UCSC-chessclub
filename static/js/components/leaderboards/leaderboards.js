const leaderboards = Vue.component('leaderboards', {
  props: {
    players: Array,
  },
  data: () => ({
    name: '',
    elo: '',
    wins: '',
    losses: '',
    draws: '',
    winrate: '',
    allScores: [],
  }),
  computed: {
    sortedList: function () {
      return this.allScores.slice().sort(function (a, b) {
        return b.elo - a.elo;
      });
    },
  },
  methods: {
    onSubmit() {
      this.players.forEach((player) =>
        this.allScores.push({
          id: player.id,
          name: player.name,
          elo: player.elo,
          wins: player.wins,
          losses: player.losses,
          draws: player.draws,
          winrate: (
            (parseInt(player.wins) * 100) /
            (parseInt(player.wins) +
              parseInt(player.losses) +
              parseInt(player.draws))
          ).toFixed(0),
        })
      );
    },
    Challenge(id) {
      console.log('Challenge', id);
    },
  },
  beforeMount() {
    this.onSubmit();
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
                <div class="td">
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
