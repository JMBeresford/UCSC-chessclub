const eloGraph = Vue.component('eloGraph', {
  props: ['games', 'user', 'players'],
  data() {
    return {
      chart: null,
    };
  },
  computed: {

  getName: function(){
  return(this.user.username);
  },

    getData: function () {
      let wins = 0;
      let losses =0;
      let draws = 0;
      let that = this;
      this.games.map((game) => {
      game.winner === that.user.id ? wins++
      : game.winner  === -1 ? draws++
      : losses++;
      });
       return [wins, draws, losses];
      },

    },

  mounted: function () {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let elo = [2100, 1950, 1920, 2000, 2150, 2190, 2300, 2250, 2251, 2300, 2354, 2390];
let eloChart = document.getElementById("eloChart").getContext('2d');
let linechart = new Chart(eloChart, {
    type: 'line',
    data: {
        labels: months,
        datasets: [ {
        label: this.getName,
            data: elo,
            backgroundColor:  "#DD8281",
            borderColor: "#DD8281",
            fill: false
        }]
    },
    options: {
        title: {
                text: "Elo Rating Over Past Year",
            display: true
        },

    }
});
},
  template: `
    <canvas id="eloChart"></canvas>
  `,
});

export default eloGraph;
