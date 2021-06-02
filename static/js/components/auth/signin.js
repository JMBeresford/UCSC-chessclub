Vue.component('signin', {
  props: { oauth2google: String },
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
        <div class="control btns">
          <button @click.prevent="submit" class="button primary">Sign In</button>
          <a class="button is-outlined" :href="oauth2google">
            <img style="width: 20px; margin-right: 5px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png">
            Sign In With Google
          </a>
        </div>
      </div>
    </form>
  `,
});
