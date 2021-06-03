const eloGraph = Vue.component('eloGraph', {
  props: ['games', 'user', 'players'],
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    getName: function () {
      return this.user.username;
    },

    getData: function () {
      let wins = 0;
      let losses = 0;
      let draws = 0;
      let that = this;
      this.games.map((game) => {
        game.winner === that.user.id
          ? wins++
          : game.winner === 0
          ? draws++
          : losses++;
      });
      return [wins, draws, losses];
    },
  },

  mounted: function () {
    console.log(Chart.defaults);
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let elo = [
      2100, 1950, 1920, 2000, 2150, 2190, 2300, 2250, 2251, 2300, 2354, 2390,
    ];
    let eloChart = document.getElementById('eloChart').getContext('2d');
    let linechart = new Chart(eloChart, {
      type: 'line',
      data: {
        labels: months,
        elements: {
          points: {
            backgroundColor: '#000',
          },
        },
        datasets: [
          {
            label: this.getName,
            data: elo,
            borderColor: '#DD8281FF',
            backgroundColor: '#DD828133',
            fill: 'start',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: {
                weight: 'normal',
              },
            },
          },
          y: {
            ticks: {
              font: {
                weight: 'normal',
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        plugins: {
          title: {
            text: 'Elo Vs. Time',
            display: true,
            color: '#D6EDFF',
            font: {
              size: 20,
            },
          },
        },
      },
    });

    console.log(linechart);
  },
  template: `
    <canvas id="eloChart"></canvas>
  `,
});

export default eloGraph;
