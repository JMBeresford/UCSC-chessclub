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
      selectedUserName: "",
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
    getChallange: function() {
      return this.challenging;
    },
    challenge: function (id) {
      // post request for new match to be created, response will be signed url
      // to redirect to
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
      //if (window) {
      //  window.location = `../profile/${id}/`;
      //}
      //this.selectedUser =
      console.log("Selected user ", id);
      this.selectedUserName= this.users[id].username;

      this.selectedUserWins= 0;
      this.selectedUserLosses= 0;
      this.selectedUserDraws= 0;
      this.selectedUserWinRate= 0;
      this.selectedUserId= id;

       let myUniqueGames= new Set();
      Object.keys(this.games).forEach((key) => {
        //myUniqueGames.add(this.games[key].id);
        if((this.games[key].player_white == this.me.id && this.games[key].player_black == id) ||
        (this.games[key].player_black == this.me.id && this.games[key].player_white == id) )
        {
            myUniqueGames.add(
            {
                "id": this.games[key].id,
                "player_white": this.games[key].player_white,
                "player_black": this.games[key].player_black,
                "winner": this.games[key].winner
            });
        }
        //myUniqueGames.add(this.games[key].player_white);

      });
      myUniqueGames = Array.from(myUniqueGames);

      for(let i = 0; i < myUniqueGames.length; i++)
      {
        if(myUniqueGames[i].winner == this.me.id)
        {
            this.selectedUserWins++;
        }
        else if(myUniqueGames[i].winner == id)
        {
            this.selectedUserLosses++;
        }
        else
        {
            this.selectedUserDraws++;
        }
      }
      this.selectedUserWinRate = this.selectedUserWins/myUniqueGames.length*100;
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
  created:function () {
    this.games = JSON.parse(this.gamedata);
    this.users = JSON.parse(this.userdata);
    this.me = JSON.parse(this.user);
    this.elos = JSON.parse(this.elodata);
    this.populatePlayers();
  },
  template: `
  <main>
    <div class="menu-items" v-if="!challenging" text-align: center>
      <div  class="banner">
        <img id="bn" src="svg/pieces/bn.svg" alt="black knight image">
        <h1>Hello, {{ getUser.username }}!</h1>
        <img src="svg/pieces/wn.svg" alt="white knight image">
      </div>
      <p class="menuLink underline_animate" @click="find_challenge()"  >Challenge Someone</p>
      <!--a class="menuLink underline_animate disabled" href="../match/computer">Challenge Computer</a-->
      <p class="menuLink underline_animate" @click="cancelChallenge()">Challenge Computer</p>
      <p class="menuLink underline_animate" href="../profile?mhist=True">Current Matches</p>
      <p class="menuLink underline_animate" href="../freeboard">Free Board!!!</p>
    </div>
    <div class="backdrop" v-if="challenging">
    <div class="block">
      <div class="box" id="challenge-modal-box">
        <div>
          <span id ="x-span" @click="cancelChallenge()">x</span>
          <h2 class="title is-2 has-text-centered">Choose an Opponent</h2>
        </div>
        <div class="columns">
          <div class="column is-half" id ="challenge-modal-column1">
            <div class="block" id="challenge-modal-container">

              <div class="wrap">

                <table>
                  <tbody>
                    <tr v-for="(entry, i) in sortedList" :key="i">
                      <td>
                        <div @click='goToProfile(entry.id)' class="td user">
                          <div class="imgwrap">
                            <img class="pfp" :src="'img/pfp/' + entry.pfp">
                          </div>
                          <p>{{ entry.name }}</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
		  </div>
          <div class="column is-half">
            <div class="block" id="challenge-modal-container">
              <div class="block">
                <h4 class="subtitle is-4">History vs {{selectedUserName}}</h4>
              </div>
              <div class="block">
                <h5 class="subtitle is-5">Wins: {{selectedUserWins}}</h5>
                <h5 class="subtitle is-5">Losses: {{selectedUserLosses}}</h5>
                <h5 class="subtitle is-5">Draws: {{selectedUserDraws}}</h5>
                <h5 class="subtitle is-5">Win-rate: {{selectedUserWinRate}} %</h5>
              </div>
              <div class="columns">
                <div class="column">
                  <button class="button is-medium" id = "challenge-modal-button" @click="challenge(selectedUserId)">Challenge</button>
                </div>
                <div class="column">
                  <button class="button is-medium" id = "challenge-modal-button" @click="cancel_challenge()">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
	  </div>
    </div>
    </div>
  </main>

  `,
});

export default homemenu;
