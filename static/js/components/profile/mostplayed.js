const mostplayed = Vue.component('mostplayed', {
  props: ['games', 'user', 'players'],
  data: function () {
    return {
      mostPlayedArray: [],
      mostWonArray: [],
      mostLostArray: [],
      mostPlayed: '',
      mostLost: '',
      mostWon: '',
    };
  },
  methods: {
    //basic outline //need to work on making this cleaner. Was going to just have one obj
    //but then calculating updates would be more cumberson.
    calcWins: function (id) {
      let wins = 0;
      let losses = 0;
      let draws = 0;
      var mostWon = {};
      var mostLost = {};
      var mostPlayed = {};

      Object.keys(this.games).forEach((key) => {
        //only count wins, losses, draws if the player was involved in the game.
        if (
          this.games[key].player_white == id ||
          this.games[key].player_black == id
        ) {
          if (this.games[key].winner === null) {
          } else {
            if (this.games[key].winner === id) {
              let loser = '';
              if (this.games[key].player_white == id) {
                loser = this.games[key].player_black;
              } else {
                loser = this.games[key].player_white;
              }
              wins++;
              //hash id of user, --> # of times won against the user
              if (!mostWon[loser]) {
                mostWon[loser] = 1; //probs a better way to do this. Just real q for now.
              } else {
                mostWon[loser] += 1;
              }
              if (typeof mostPlayed[loser] == 'undefined') {
                mostPlayed[loser] = 1; //probs a better way to do this. Just real q for now.
              } else {
                mostPlayed[loser] += 1;
              }
              //also put into hashtbl
            } else if (this.games[key].winner === 0) {
              let drawer = '';
              if (this.games[key].player_white == id) {
                drawer = this.games[key].player_black;
              } else {
                drawer = this.games[key].player_white;
              }
              draws++;
              if (typeof mostPlayed[drawer] == 'undefined') {
                mostPlayed[drawer] = 1; //probs a better way to do this. Just real q for now.
              } else {
                mostPlayed[drawer] += 1;
              }
              //put into hashtbl
            } else {
              let winner = '';
              if (this.games[key].player_white == id) {
                winner = this.games[key].player_black;
              } else {
                winner = this.games[key].player_white;
              }
              if (typeof mostPlayed[winner] == 'undefined') {
                mostPlayed[winner] = 1; //probs a better way to do this. Just real q for now.
              } else {
                mostPlayed[winner] += 1;
              }
              if (typeof mostLost[winner] == 'undefined') {
                mostLost[winner] = 1; //probs a better way to do this. Just real q for now.
              } else {
                mostLost[winner] += 1;
              }
              losses++;
              //put into hashtbl.
            }
          }
        } else {
        }
      });
      if (Object.keys(mostWon).length > 0) {
        var max = Object.keys(mostWon).reduce(function (a, b) {
          return mostWon[a] > mostWon[b] ? a : b;
        });
        this.mostWonArray.push({ id: max, amount: mostWon[max] });
      }
      if (Object.keys(mostLost).length > 0) {
        var max2 = Object.keys(mostLost).reduce(function (a, b) {
          return mostLost[a] > mostLost[b] ? a : b;
        });
        this.mostLostArray.push({ id: max2, amount: mostLost[max2] });
      }
      if (Object.keys(mostPlayed).length > 0) {
        var max3 = Object.keys(mostPlayed).reduce(function (a, b) {
          return mostPlayed[a] > mostPlayed[b] ? a : b;
        });
        this.mostPlayedArray.push({ id: max3, amount: mostPlayed[max3] });
      }

      axios
        .all([
          max ? axios.get('../get/pfp?id=' + max) : () => {},
          max2 ? axios.get('../get/pfp?id=' + max2) : () => {},
          max3 ? axios.get('../get/pfp?id=' + max3) : () => {},
        ])
        .then((responseArr) => {
          //this will be executed only when all requests are complete
          this.mostWonArray.push({ url: responseArr[0].data });
          axios.get(`../get/user?id=${max}`).then((res) => {
            this.mostWon = res.data[max].username;
          });
          this.mostLostArray.push({ url: responseArr[1].data });
          axios.get(`../get/user?id=${max2}`).then((res) => {
            this.mostLost = res.data[max2].username;
          });
          this.mostPlayedArray.push({ url: responseArr[2].data });
          axios.get(`../get/user?id=${max3}`).then((res) => {
            this.mostPlayed = res.data[max3].username;
          });
        });

      return [this.mostWonArray, this.mostLostArray, this.mostPlayedArray];
    },
  },

  created: function () {
    this.calcWins(this.user.id);
  },
  template: `
  <div id="mostplayed">
    <div v-if="mostPlayedArray[1]" class="mostplayeduser">
      <p class="top"> Most Played </p>
      <div class="imgwrap">
        <img class="pfp" :src="'img/pfp/'+ mostPlayedArray[1].url">
      </div>
      <p>{{ mostPlayed }}</p>
    </div>
    <div v-if="mostWonArray[1]" class="mostwonagainst">
      <p class="top"> Most Won </p>
      <div class="imgwrap">
          <img class="pfp" :src="'img/pfp/'+ mostWonArray[1].url">
        </div>
        <p> {{ mostWon }} </p>
    </div>
    <div v-if="mostLostArray[1]" class="mostlostagainst">
      <p class="top"> Most Lost </p>
      <div class="imgwrap">
          <img class="pfp" :src="'img/pfp/'+ mostLostArray[1].url">
      </div>
      <p> {{ mostLost }} </p>
    </div>
  </div>
  `,
});

export default mostplayed;
