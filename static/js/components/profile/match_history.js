const match_history = Vue.component('match_history', {
  props: ['games', 'user'],
  data() {
    return {
      all_games: [],
    };
  },
  computed: {
    sortedGames: function () {
      return this.all_games.sort((a, b) => {
        if (b.winner === null) {
          return 1;
        } else {
          let d1 = new Date(b.date);
          let d2 = new Date(a.date);
          return d1 - d2;
        }
      });
    },
  },
  methods: {
    getUsername: async function (id) {
      axios.get('../get/user?id=' + id).then(function (response) {
        return response.data[Object.keys(response.data)[0]].username;
      });
    },
    getPfp: async function (id) {
      axios.get('../get/pfp?id=' + id).then(function (response) {
        return `../static/img/pfp/${response.data}`;
      });
    },
    populateGames: function () {
      this.games.forEach((game) => {
        let opponent =
          game.player_black != this.user.id
            ? game.player_black
            : game.player_white;

        axios
          .all([
            axios.get('../get/user?id=' + opponent),
            axios.get('../get/pfp?id=' + opponent),
          ])
          .then((responseArr) => {
            this.all_games.push({
              ...game,
              opponent: {
                id: opponent,
                username: Object.values(responseArr[0].data)[0].username,
                pfp: responseArr[1].data,
              },
            });
          });
      });
    },
    goToProfile: function (id) {
      if (window) {
        window.location = `../profile/${id}/`;
      }
    },
    goToGame: function (id) {
      if (window) {
        window.location = `../game/${id}/`;
      }
    },
  },
  mounted: function () {
    // console.log("MATCH HISTORY");
    // console.log(this.games);
    // console.log(this.user);
  },
  created: function () {
    this.populateGames();
  },
  template: `
    <div id="match-history-container">
        <table>
            <thead>
                <th>
                  <div class="headwrap">
                    Opponent
                  </div>
                </th>
                <th>
                  <div class="headwrap">
                    Date Started
                  </div>
                </th>
                <th>
                  <div class="headwrap">
                    Status
                  </div>
                </th>
                <th>
                      
                </th>
            </thead>
            <tbody>
                <tr v-for="game in sortedGames">
                    <td>
                        <div @click='goToProfile(game.opponent.id)' class="td user">
                            <div class="imgwrap">
                                <img class="pfp" :src="'img/pfp/' + game.opponent.pfp">
                            </div>
                            <p>{{ game.opponent.username }}</p>
                        </div>
                    </td>
                    <td>
                        <div class="td">
                            <p>
                                {{ new Date(game.date).toLocaleDateString({},{timeZone:"UTC",month:"long", day:"2-digit", year:"numeric"}) }}
                            </p>
                        </div>
                    </td>
                    <td>
                        <div class="td">
                            <p v-if="!game.winner">In Progress</p>
                            <p v-else-if="game.winner == 0">Draw</p>
                            <p v-else-if="game.winner == game.opponent.id">Loss</p>
                            <p v-else>Won</p>
                        </div>
                    </td>
                    <td>
                        <div v-if="!game.winner" class="td buttontd">
                            <button class="btn" @click='goToGame(game.id)'>
                                Go
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  `,
});

export default match_history;
