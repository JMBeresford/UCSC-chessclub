const leaderboards = Vue.component('leaderboards', {
    props: {
      players:[],
    },
  data: () => ({ name: "", elo: "", wins:"", losses:"", draws:"", winrate:"", allScores: [] }),
  computed: {
    sortedList: function() {
      return this.allScores.slice().sort(function(a, b) {
        return b.elo - a.elo;
      });
    },
  },
  methods: {
    onSubmit() {
    console.log(this.players);
    this.players.forEach(player =>this.allScores.push({ name: player.name, elo: player.elo, wins: player.wins, losses: player.losses,
        draws:player.draws, winrate: player.winrate },));
    },
    Challenge() {
      console.log("Challenge", this.players.name);
    },
  },
  template: `
    <div class="container">
    <h1 class=" text-center">Leaderboard</h1>
   <button type="button" @click="onSubmit" class="btn btn-dark">
        LoadData
      </button>
    <table class="table is-striped is-hoverable mt-5">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">User</th>
          <th scope="col">Elo</th>
          <th scope="col">Wins</th>
          <th scope="col">Losses</th>
          <th scope="col">Draws</th>
          <th scope="col">Win Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in sortedList" :key="i">
          <th scope="row">{{ ++i }}</th>
          <td>{{ entry.name }}</td>
          <td>{{ entry.elo }}</td>
          <td>{{ entry.wins }}</td>
          <td>{{ entry.losses }}</td>
          <td>{{ entry.draws }}</td>
          <td>{{ entry.winrate }}</td>
          <button type="button" @click="Challenge" class="btn btn-dark">
            Challenge
        </button>
        </tr>
      </tbody>
    </table>
  </div>


     `,
});

export default leaderboards;
