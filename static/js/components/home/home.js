const homemenu = Vue.component('homemenu', {
  // Vue component for menu on home page
  props: {
    players: Array,
    elodata: String,

    user: String,
    gamedata: String,
    userdata: String,
  },
  computed: {
    getUser: function () {
      return JSON.parse(this.user);
    },
    sortedList: function () {
      return this.allScores.slice().sort(function (a, b) {
        return b.elo - a.elo;
      });
    },
  },
  data() {
    return {
      games: Object,
      users: Object,
      me: Object,
      challenging: false,
      selectedUserId: 0,
      selectedUserName: '',
      selectedUserWins: 0,
      selectedUserLosses: 0,
      selectedUserDraws: 0,
      selectedUserWinRate: 0,
      elos: Object,
      allScores: [],
    };
  },
  methods: {
    find_challenge: function () {
      this.challenging = true;
    },
    cancel_challenge: function () {
      this.challenging = false;
    },
    cancelChallenge: function () {
      this.challenging = false;
    },
    getChallange: function () {
      return this.challenging;
    },
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
      console.log(this.users);
      //use a set to remove duplicats when calculating all users. Need to determine if this is OK when debugging.
      let myUniquePlayers = new Set();
      Object.keys(this.users).forEach((key) => {
        myUniquePlayers.add(this.users[key].id);
      });
      myUniquePlayers = Array.from(myUniquePlayers);
      for (var i = 0; i < myUniquePlayers.length; i++) {
        //id to get metadata of, from elos table, ie, only rank a player if they have a default elo value.
        let id = myUniquePlayers[i];
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
      //if (window) {
      //  window.location = `../profile/${id}/`;
      //}
      //this.selectedUser =
      console.log('Selected user ', id);
      this.selectedUserName = this.users[id].username;

      this.selectedUserWins = 0;
      this.selectedUserLosses = 0;
      this.selectedUserDraws = 0;
      this.selectedUserWinRate = 0;
      this.selectedUserId = id;

      let myUniqueGames = new Set();
      Object.keys(this.games).forEach((key) => {
        //myUniqueGames.add(this.games[key].id);
        if (
          (this.games[key].player_white == this.me.id &&
            this.games[key].player_black == id) ||
          (this.games[key].player_black == this.me.id &&
            this.games[key].player_white == id)
        ) {
          myUniqueGames.add({
            id: this.games[key].id,
            player_white: this.games[key].player_white,
            player_black: this.games[key].player_black,
            winner: this.games[key].winner,
          });
        }
        //myUniqueGames.add(this.games[key].player_white);
      });
      myUniqueGames = Array.from(myUniqueGames);

      for (let i = 0; i < myUniqueGames.length; i++) {
        if (myUniqueGames[i].winner == this.me.id) {
          this.selectedUserWins++;
        } else if (myUniqueGames[i].winner == id) {
          this.selectedUserLosses++;
        } else {
          this.selectedUserDraws++;
        }
      }
      this.selectedUserWinRate = (
        (this.selectedUserWins / myUniqueGames.length) *
        100
      ).toFixed(0);
      if (this.selectedUserWinRate === 'NaN') {
        this.selectedUserWinRate = 0;
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
    canChallenge: function (id) {
      for (let game of Object.values(this.games)) {
        if (game.winner) {
          continue;
        }
        if (game.player_white == id || game.player_black == id) {
          return false;
        }
      }

      return true;
    },
    challenge: function (id) {
      console.log('Challenge', id);
      let player1;
      let player2;
      if (Math.random() > 0.5) {
        player1 = id;
        player2 = this.getUser.id;
      } else {
        player1 = this.getUser.id;
        player2 = id;
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
          str1 = str1.replace('home', str2);
          window.location.href = str1;
          //console.log(window.location.href);
          //window.location.replace(str2);
        });
    },
  },
  created: function () {
    this.games = JSON.parse(this.gamedata);
    this.users = JSON.parse(this.userdata);
    this.me = JSON.parse(this.user);
    this.elos = JSON.parse(this.elodata);
    this.populatePlayers();
    this.selectedUserId = -1;
  },
  template: `
  <main>
    <div class="menu-items" text-align: center>
      <div  class="banner">
        <img id="bn" src="svg/pieces/bn.svg" alt="black knight image">
        <h1>Hello, {{ getUser.username }}!</h1>
        <img src="svg/pieces/wn.svg" alt="white knight image">
      </div>
      <p class="menuLink underline_animate" @click="find_challenge()"  >Challenge Someone</p>
      <a class="menuLink underline_animate disabled" href="../match/computer">Challenge Computer</a>
      <a class="menuLink underline_animate" href="../profile?mhist=True">Current Matches</a>
      <a class="menuLink underline_animate" href="../freeboard">Free Board</a>
    </div>
    <div class="backdrop" v-show="challenging" transition="fade" @click.self="() => challenging = false">
      <div class="box" id="challenge-modal-box">
        <div class="block">
          <span id ="x-span" @click="cancelChallenge()"><i class="fa fa-close"></i></span>
          <!--h2 class="title is-2 has-text-centered">Choose an Opponent</h2-->
          <h1 class="modal-title">Choose an Opponent</h1>
        </div>
        <div class="halves">
          <div id ="challenge-modal-column1">
            <div class="block" id="challenge-modal-container">
              <div class="wrap">
                <div class="opponent" v-for="(entry, i) in sortedList" :class="{selected: selectedUserId == entry.id}" :key="entry.id">
                  <div @click='goToProfile(entry.id)' v-if="canChallenge(entry.id)" class="td user">
                    <div class="imgwrap">
                      <img class="pfp" :src="'img/pfp/' + entry.pfp">
                    </div>
                    <p>{{ entry.name }}</p>
                  </div>
                </div>
              </div>
            </div>
		  </div>
          <div v-if="selectedUserId != -1" class="right">
            <h4 class="is-4 has-text-weight-semibold">History vs {{selectedUserName}}</h4>
            <h5>Wins: {{selectedUserWins}}</h5>
            <h5>Losses: {{selectedUserLosses}}</h5>
            <h5>Draws: {{selectedUserDraws}}</h5>
            <h5>Win-rate: {{selectedUserWinRate}} %</h5>
            <div class="buttons">
              <button class="button" @click="challenge(selectedUserId)">Challenge</button>
              <button class="button" @click="cancel_challenge()">Cancel</button>
            </div>
          </div>
	  </div>
    </div>
    </div>
  </main>
  `,
});

export default homemenu;
