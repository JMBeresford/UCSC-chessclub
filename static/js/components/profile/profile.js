const profile = Vue.component('profile', {
  props: {
    user: String,
    games: String,
    isme: Boolean,
    me: Object,
    matchhistory: Boolean,
    pfp: String,
  },
  computed: {
    getUser: function () {
      return JSON.parse(this.user);
    },
    getGames: function () {
      return JSON.parse(this.games);
    },
    getPfp: function () {
      return `img/pfp/${this.pfp}`;
    },
  },
  created: function () {
    if (this.matchhistory) {
      this.showCharts = false;
    } else {
      this.showCharts = true;
    }

    this.status = this.getUser.status
      ? this.getUser.status
      : 'Set your status...';

    Chart.defaults.font.family = 'Poppins';
    Chart.defaults.color = '#D6EDFF';
    Chart.defaults.font.weight = 3;
  },
  methods: {
    toggleView: function () {
      this.showCharts = !this.showCharts;
    },
    canChallenge: function () {
      if (this.isme) {
        return false;
      }

      for (let game of Object.values(this.games)) {
        if (game.winner) {
          continue;
        }
        if (
          game.player_white == this.getUser.id ||
          game.player_black == this.getUser.id
        ) {
          return false;
        }
      }

      return true;
    },
    challenge: function () {
      let player1;
      let player2;
      if (Math.random() > 0.5) {
        player1 = this.me.id;
        player2 = this.getUser.id;
      } else {
        player1 = this.getUser.id;
        player2 = this.me.id;
      }
      console.log(player1);
      console.log(player2);
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
    handleInputExit: function (e) {
      if (e.type !== 'keyup' && e.target.classList.contains('statusedit')) {
        return;
      } else {
        this.editingStatus = false;

        if (
          this.status != this.getUser.status &&
          this.status !== 'Set your status...'
        ) {
          axios
            .post('../post/status', {
              status: this.status,
              id: this.getUser.id,
            })
            .then((res) => {
              if (res.status == 200) {
                let user = this.getUser;
                user.status = this.status;
                // modifying props like this is bad, only doing because lazy and circumstances allow it
                this.user = JSON.stringify(user);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
  },
  data() {
    return {
      showCharts: null,
      editingStatus: false,
      status: '',
    };
  },
  template: `
    <main @click.stop="handleInputExit">
        <div class="bg">
            <div class="wrapper">
                <div class="info">
                    <label for="image">
                        <input type="file" name="image" id="image" style="display:none;"/>
                        <img :src="getPfp">
                    </label>
                    <div class="text">
                        <p class="username"> {{getUser.username}} </p>
                        <p @click.self.stop="() => editingStatus = true" v-if="isme" :class="{isme: isme, editing: editingStatus}" class="status"> {{getUser.status ? getUser.status : "Set your status..."}} </p>
                        <p v-else class="status"> {{getUser.status}} </p>
                        <input class="statusedit" v-if="editingStatus" v-model='status' v-on:keyup.enter="handleInputExit">
                    </div>
                    <div class="buttons">
                        <button @click="this.toggleView" :class="{stats: !showCharts}">{{showCharts ? "Match History" : "User Stats"}}</button>
                        <button @click="challenge()" v-if="canChallenge()">Challenge</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="charts" v-bind:class="{ hide: !showCharts, visible: showCharts}">
                <div class="graph1container">
                    <eloGraph :user=getUser :games=getGames></eloGraph>
                </div>
                <div>
                  <eloGraph2 :user=getUser :games=getGames></eloGraph2>
                  <mostplayed :user=getUser :games=getGames></mostplayed>
                </div>

            </div>

            <div class="match-history" v-bind:class="{ hide: showCharts, visible: !showCharts}">
                <match_history :user=getUser :games=getGames></match_history>
            </div>
        </div>
    </main>
    `,
});

export default profile;
