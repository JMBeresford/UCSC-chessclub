const profile = Vue.component('profile', {
  props: {
    user: String,
    games: String,
    isme: Boolean,
  },
  computed: {
    getUser: function () {
      return JSON.parse(this.user);
    },
    getGames: function () {
      return JSON.parse(this.games);
    },
  },
  data() {
    return {};
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
                        <button>Match History</button>
                        <button v-if="!isme">Challenge</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="charts">
                <div>
                    Elo Rating
                    <!-- replace with chart -->
                </div>
                <div>
                    Games
                    <!-- replace with chart -->
                </div>
            </div>
        </div>
    </main>
    `,
});

export default profile;
