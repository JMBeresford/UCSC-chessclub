const eloGraph2 = Vue.component('eloGraph2', {
  props: ['games', 'user', 'players'],
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    getData: function () {
        console.log(this.games);
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
    let attributes = ['Wins', 'Losses', 'Draws'];
    let elem = document.getElementById('eloChart2').getContext('2d');
    this.chart = new Chart(elem, {
      type: 'pie',
      data: {
        labels: attributes,
        datasets: [
          {
            fill: true,
            backgroundColor: [
            "rgb(214, 237, 255)",
              'rgb(221, 130, 129)',
              "rgb(109, 170, 154)",
            ],
            borderWidth: 0,
            data: this.getData,
          },
        ],
      },
options: {
            legend: {
               display:false,
            },

        },
    });

  },
  template: `
    <canvas id="eloChart2"></canvas>
  `,
});

export default eloGraph2;
