const populate = Vue.component('populate', {
  data() {
    return {
      players: [
        {
          email: 'mail@mail.com',
          username: 'Derek',
          password: 'pass',
          first_name: 'unused',
          last_name: 'unused',
        },
        {
          email: 'mail2@mail.com',
          username: 'William',
          password: 'pass',
          first_name: 'unused',
          last_name: 'unused',
        },
        {
          email: 'mail3@mail.com',
          username: 'Sally',
          password: 'pass',
          first_name: 'unused',
          last_name: 'unused',
        },
        {
          email: 'mail4@mail.com',
          username: 'Sam',
          password: 'pass',
          first_name: 'unused',
          last_name: 'unused',
        },
        {
          email: 'mail5@mail.com',
          username: 'Jobe',
          password: 'pass',
          first_name: 'unused',
          last_name: 'unused',
        },
        {
          email: 'mail6@mail.com',
          username: 'Chris',
          password: 'pass',
          first_name: 'unused',
          last_name: 'unused',
        },
      ],
      form: {
        email: '',
        username: '',
        password: '',
        password2: '',
        first_name: 'Undefined', // unused, but py4web expects it at register route
        last_name: 'Undefined', // unused, but py4web expects it at register route
      },
      errors: {},
      done: [false, false, false, false, false, false],
      error: false,
    };
  },
  methods: {
    submit: function (form, i) {
      let that = this;
      axios
        .post('../auth/api/register', form)
        .then((res) => {
          if (res.data.errors) {
            that.error = true;
          } else if (res.data.status == 'error') {
            console.log(res.data);
            that.error = true;
          } else {
            that.done[i] = true;
            that.$forceUpdate();
          }
        })
        .catch((err) => {
          console.log(err);
          that.error = true;
        });
    },
  },
  mounted: function () {
    this.players.forEach((player, idx) => {
      this.submit(player, idx);
    });
  },
  template: `
    <div>
      <p>Populating...</p>
      <p v-if="done[1] == true">User 1 Done!</p>
      <p v-if="done[2] == true">User 2 Done!</p>
      <p v-if="done[3] == true">User 3 Done!</p>
      <p v-if="done[4] == true">User 4 Done!</p>
      <p v-if="done[5] == true">User 5 Done!</p>
      <p v-if="done[6] == true">User 6 Done!</p>
      <p v-if="error">Error, perhaps you've already populated?</p>
    </div>
  `,
});

export default populate;
