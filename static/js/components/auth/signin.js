Vue.component('signin', {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errors: {},
      next: '../home',
      invalidEmail: false,
      invalidCreds: false,
    };
  },
  methods: {
    submit: function () {
      axios
        .post('../auth/api/login', this.form)
        .then((res) => {
          if (res.data.errors) {
            this.errors = res.data.errors;
          } else if (res.data.status == 'error') {
            //console.log(this.errors);
          } else {
            window.location = this.next;
          }
        })
        .catch((err) => {
          //console.log(err.response);
          if (err.response.data.message === 'Invalid email') {
            this.invalidEmail = true;
            this.form.email = '';
          } else if (err.response.data.message === 'Invalid Credentials') {
            this.invalidCreds = true;
            this.form.password = '';
          }
        });
    },
  },
  template: `
    <form class="form" action="POST">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input v-model="form.email" class="input is-success" type="text" placeholder="Enter Username">
        </div>
        <p :class="{disabled: !this.invalidEmail}" class="help is-danger">Invalid email</p>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input v-model="form.password" class="input is-success" type="password" placeholder="Enter Password">
        </div>
        <p :class="{disabled: !this.invalidCreds}" class="help is-danger">Incorrect Password</p>
      </div>

      <div class="field">
        <div class="control">
          <button @click.prevent="submit" class="button primary">Submit</button>
        </div>
      </div>
    </form>
  `,
});
