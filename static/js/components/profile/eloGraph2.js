const eloGraph2 = Vue.component('eloGraph2', {
  props: ['games', 'user', 'players'],
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    getData: function () {
      let wins = 0;
      let losses = 0;
      let draws = 0;
      let that = this;
      Object.keys(this.games).forEach((key) => {
        //only count wins, losses, draws if the player was involved in the game.
        if (
          this.games[key].player_white == that.user.id ||
          this.games[key].player_black == that.user.id
        ) {
          if (this.games[key].winner === null) {
          } else {
            this.games[key].winner === that.user.id
              ? wins++
              : this.games[key].winner === 0
              ? draws++
              : losses++;
          }
        }
      });
      if (wins == 0 && losses == 0 && draws == 0) {
        draws = 1; //temp data.
      }
      return [wins, losses, draws];
    },
  },

  mounted: function () {
    let attributes = ['Wins', 'Losses', 'Draws'];
    let elem = document.getElementById('eloChart2').getContext('2d');
    this.chart = new Chart(elem, {
      type: 'doughnut',
      data: {
        labels: attributes,
        datasets: [
          {
            fill: true,
            backgroundColor: [
              'rgb(214, 237, 255)',
              'rgb(221, 130, 129)',
              'rgb(109, 170, 154)',
            ],
            borderWidth: 0,
            data: this.getData,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            text: 'Game Statistics',
            display: true,
            color: '#D6EDFF',
            font: {
              size: 20,
            },
          },
          tooltip: {
            bodyFont: {
              weight: 'normal',
            },
          },
          legend: {
            display: true,
            labels: {
              font: {
                weight: 'normal',
              },
            },
          },
        },
      },
    });
  },
  template: `
    <canvas id="eloChart2"></canvas>
  `,
});

export default eloGraph2;
