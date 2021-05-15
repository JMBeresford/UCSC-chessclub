const ingamechat = Vue.component('ingamechat', {
  props: {
    game: Object,
    players: Object,
  },
  data() {
    return {};
  },
  mounted: function () {},
  template: `
    <div id="ingamechat"></div>
  `,
});

export default ingamechat;
