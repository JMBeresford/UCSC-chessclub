const profile = Vue.component('profile', {
  props: {
    user: String,
    games: String,
    isme: Boolean,
    matchHistory: Boolean,
  },
  computed: {
    getUser: function () {
      return JSON.parse(this.user);
    },
    getGames: function () {
      return JSON.parse(this.games);
    },
  },
  mounted: function () {
    if (this.matchHistory) {
      this.showCharts = false;
    } else {
      this.showCharts = true;
    }
  },
  methods: {
    toggleView: function () {
      this.showCharts = !this.showCharts;
    },
  },
  data() {
    return {
      showCharts: true,
    };
  },
  template: `
    <main>
        <div class="bg">
            <div class="wrapper">
                <div class="info">
                    <label for="image">
                        <input type="file" name="image" id="image" style="display:none;"/>
                        <img src="https://via.placeholder.com/100x100">
                    </label>
                    <div class="text">
                        <p class="username"> {{getUser.username}} </p>
                        <p v-if="isme" class="status"> {{getUser.status ? getUser.status : "Set your status..."}} </p>
                        <p v-else class="status"> {{getUser.status}} </p>
                    </div>
                    <div class="buttons">
                        <button @click="this.toggleView">Match History</button>
                        <button v-if="!isme">Challenge</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="charts" v-bind:class="{ hide: !showCharts, visible: showCharts}">
                <div>
                    Elo Rating
                    <!-- replace with chart -->
                </div>
                <div>
                    Games
                    <!-- replace with chart -->
                </div>
            </div>

            <div class="match-history" v-bind:class="{ hide: showCharts, visible: !showCharts}">
              <p>ass</p>
            </div>
        </div>
    </main>
    `,
});

export default profile;
