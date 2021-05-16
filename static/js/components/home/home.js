const homemenu = Vue.component('homemenu', {
  // Vue component for menu on home page
  props: {
    user: String,
  },
  computed: {
    getUser: function () {
      return JSON.parse(this.user);
    },
  },
  data() {
    return {
      challenging: false,
    };
  },
  methods: {
    find_challenge: function () {
      this.challenging = true;
    },
    cancelChallenge: function () {
      this.challenging = false;
    },
    challenge: function (id) {
      // post request for new match to be created, response will be signed url
      // to redirect to
    },
  },
  template: `
  <main>
    <div class="banner">
      <img id="bn" src="svg/pieces/bn.svg" alt="black knight image">
      <h1>Hello, {{ getUser.username }}!</h1>
      <img src="svg/pieces/wn.svg" alt="white knight image">
    </div>
    <p class="menuLink underline_animate" @click="find_challenge()">Challenge Someone</p>
    <a class="menuLink underline_animate disabled" href="../match/computer">Challenge Computer</a>
    <a class="menuLink underline_animate" href="../profile?mhist=True">Current Matches</a>
    <a class="menuLink underline_animate" href="../freeboard">Free Board</a>
  </main>
  `,
});

export default homemenu;
