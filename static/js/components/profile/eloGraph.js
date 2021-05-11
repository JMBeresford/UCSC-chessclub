const eloGraph = Vue.component('eloGraph', {
  props: ['games', 'user', 'players'],
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    getWins: function () {
      let wins = 0;
      let that = this;
      this.games.map((game) => {
        if (game.winner === that.user.id) {
          wins++;
        }
      });

      return wins;
    },
  },
  mounted: function () {
    console.log(this.getWins);
    let attributes = ['Wins', 'Losses', 'Draws'];
    let elem = document.getElementById('eloChart').getContext('2d');
    this.chart = new Chart(elem, {
      type: 'pie',
      data: {
        labels: attributes,
        datasets: [
          {
            label: 'Magnus Carlsen',
            fill: true,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            data: [21, 12, 45],
          },
        ],
      },
      options: {
        title: {
          text: 'Wins, Losses, and Draws',
          display: true,
        },
      },
    });
  },
  template: `
    <canvas id="eloChart"></canvas>
  `,
});

export default eloGraph;
