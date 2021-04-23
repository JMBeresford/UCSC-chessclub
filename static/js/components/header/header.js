const headercomponent = Vue.component('headercomponent', {
  props: {
    loggedin: Boolean,
    purl: String,
    sourl: String,
    lburl: String,
    siurl: String,
    regurl: String,
    hurl: String,
  },
  data() {
    return {};
  },
  template: `
    <header class="header" role="navigation" aria-label="main navigation">
      <nav class="navcontent">
        <a :href="hurl" class="brandWrapper">
          <img src="svg/horses.svg">
          <h3>UCSC Chess Club</h3>
        </a>
        <div class="buttons">
          <template v-if=loggedin>
            <a class="btn underline_animate" :href="lburl">Leaderboards</a></li>
            <a class="btn underline_animate" :href="purl">Profile</a>
            <a class="btn underline_animate" :href="sourl">Sign Out</a>
          </template>
          <template v-else >
            <a class="btn underline_animate" :href="siurl">Sign in</a>
            <a class="btn underline_animate" :href="regurl">Register</a>
          </template>
        </div>
      </nav>
    </header>
  `,
});

export default headercomponent;
