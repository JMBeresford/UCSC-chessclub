const mostplayed = Vue.component('mostplayed', {
  props: ['games', 'user', 'players'],
  data: function () {
    return {
      mostPlayedArray: [],
      mostWonArray: [],
      mostLostArray: [],
    };
  },
  methods: {
    //basic outline //need to work on making this cleaner. Was going to just have one obj
    //but then calculating updates would be more cumberson.
  calcWins: function (id) {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    console.log(this.games);
    var mostWon = {};
    var mostLost = {};
    var mostPlayed ={};

    Object.keys(this.games).forEach((key) => {
      //only count wins, losses, draws if the player was involved in the game.
      if (
        this.games[key].player_white == id ||
        this.games[key].player_black == id
      ) {
        if(this.games[key].winner ===  null)
          {


          }
          else{       
            
            if(this.games[key].winner === id)
        {
          let loser  = "";
          if(this.games[key].player_white == id)
          {
            loser = this.games[key].player_black;
          }
          else{
            loser = this.games[key].player_white;

          }
          wins++;
          //hash id of user, --> # of times won against the user
          if (typeof mostWon[loser] == 'undefined')
          {
            mostWon[loser]= 1; //probs a better way to do this. Just real q for now.
          }
          else
          {
            mostWon[loser] += 1;
          }
          if (typeof mostPlayed[loser] == 'undefined')
          {
            mostPlayed[loser]= 1; //probs a better way to do this. Just real q for now.
          }
          else
          {
            mostPlayed[loser] += 1;
          }
          //also put into hashtbl
        }
        else if (this.games[key].winner === 0)
        {
          let drawer  = "";
          if(this.games[key].player_white == id)
          {
            drawer = this.games[key].player_black;
          }
          else{
            drawer = this.games[key].player_white;

          }
          draws++;
          if (typeof mostPlayed[drawer] == 'undefined')
          {
            mostPlayed[drawer]= 1; //probs a better way to do this. Just real q for now.
          }
          else
          {
            mostPlayed[drawer] += 1;
          }
          //put into hashtbl
        }
        else{

          let winner  = "";
          if(this.games[key].player_white == id)
          {
            winner = this.games[key].player_black;
          }
          else{
            winner = this.games[key].player_white;

          }if (typeof mostPlayed[winner] == 'undefined')
          {
            mostPlayed[winner]= 1; //probs a better way to do this. Just real q for now.
          }
          else
          {
            mostPlayed[winner] += 1;
          }
          if (typeof mostLost[winner] == 'undefined')
          {
            mostLost[winner]= 1; //probs a better way to do this. Just real q for now.
          }
          else
          {
            mostLost[winner] += 1;}
            losses++;
          //put into hashtbl.
        }
      }}
      
      else {
        console.log('Not counting');
      }
    });
    console.log(mostWon);
    console.log(mostLost);
    let max = Object.keys(mostWon).reduce(function(a, b){ return mostWon[a] > mostWon[b] ? a : b });
    console.log("Current Logged in user has won the most against user with id: " +max +" with this many " + mostWon[max] + " wins");//id of user with most won against.
    let max2 = Object.keys(mostLost).reduce(function(a, b){ return mostLost[a] > mostLost[b] ? a : b });
    console.log(max2);
    let max3 = Object.keys(mostPlayed).reduce(function(a, b){ return mostPlayed[a] > mostPlayed[b] ? a : b });
    console.log(mostPlayed[max3]);

    this.mostWonArray.push({id: max, amount: mostWon[max]});
    this.mostLostArray.push({id: max2, amount: mostLost[max2]})
    this.mostPlayedArray.push({id: max3, amount: mostLost[max3]})

    axios
          .all([
            axios.get('../get/pfp?id=' + max),
            axios.get('../get/pfp?id=' + max2),
            axios.get('../get/pfp?id=' + max3),

          ])
          .then((responseArr) => {
            //this will be executed only when all requests are complete
            console.log(responseArr[0].data);
            console.log(responseArr[1].data);
            console.log(responseArr[2].data);
            this.mostWonArray.push({url: responseArr[0].data});
            this.mostLostArray.push({url: responseArr[1].data});
            this.mostPlayedArray.push({url: responseArr[2].data});

            });

    return [this.mostWonArray, this.mostLostArray, this.mostPlayedArray];
  },
},

created: function () {
  let arr = this.calcWins(this.user.id);
  console.log(arr[0]);

},
  template: `
  <div id="mostplayed">
    <div class="mostplayeduser">
      <div class="imgwrap">
        <img class="pfp" :src="'img/pfp/'+ mostPlayedArray[1].url">
      </div>
    </div>
    <div class="mostwonagainst">
    <div class="imgwrap">
        <img class="pfp" :src="'img/pfp/'+ mostWonArray[1].url">
    </div>
    </div>
    <div class="mostlostagainst">
    <div class="imgwrap">
        <img class="pfp" :src="'img/pfp/'+ mostLostArray[1].url">
    </div>
    </div>
  </div>
  `,
});

export default mostplayed;
