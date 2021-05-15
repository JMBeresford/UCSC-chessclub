const customchessboard = Vue.component('customchessboard', {
  data() {
    return {
      toMove: String,
      fen: String,
      check: String,
    };
  },
  methods: {
    handleMove: function (threats) {
      this.toMove = threats.turn;

      if (this.$refs.chess.game.in_check()) {
        this.check = this.toMove;
        this.$emit('check', this.check);
      } else {
        this.check = '';
      }
    },
  },
  mounted: function () {
    if (window) {
      window.addEventListener('resize', function () {
        document.body.dispatchEvent(new Event('chessground.resize'));
      });
    }
  },
  template: `
    <div id="custom-board">
      <h1>{{toMove}} to move</h1>
      <div class="wrapper">
        <chessboard ref="chess" v-on:onMove="handleMove"></chessboard>
      </div>
      <!-- the inner component has ref="board" -->
    </div>
  `,
});

export default customchessboard;
