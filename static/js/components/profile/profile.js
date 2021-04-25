const profile = Vue.component('profile', {
  props: {
    user: {},
    games: {},
    'is-me': Boolean,
  },
  data() {
    return {};
  },
  template: `
    <p>{{games}}</p>
  `,
});

export default profile;
