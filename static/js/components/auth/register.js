Vue.component('register', {
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: '',
        password2: '',
        first_name: 'Undefined', // unused, but py4web expects it at register route
        last_name: 'Undefined', // unused, but py4web expects it at register route
      },
      errors: {},
      next: 'registration_successful.html',
      invalidEmail: false,
      usedEmail: false,
    };
  },
  methods: {
    submit: function () {
      let form = {};
      Object.assign(form, this.form); // copy form data so we can delete pass2
      delete form['password2'];

      axios
        .post('../auth/api/register', form)
        .then((res) => {
          if (res.data.errors) {
            this.errors = res.data.errors;
          } else if (res.data.status == 'error') {
            console.log(this.errors);
          } else {
            window.location = this.next;
          }
        })
        .catch((err) => {
          if (
            err.response.data.errors.email ===
            'Value already in database or empty'
          ) {
            this.usedEmail = true;
          } else if (
            err.response.data.errors.email === 'Enter a valid email address'
          ) {
            this.invalidEmail = true;
          }
          console.log(err.response);
        });
    },
  },
  computed: {
    pass_match: function () {
      return (
        this.form.password === this.form.password2 || this.form.password2 === ''
      );
    },
  },
  template: `
    <form class="form" action="POST">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input v-model="form.email" class="input is-success" type="text" placeholder="Enter Email">
        </div>
        <p :class="{disabled: !this.invalidEmail}" class="help is-danger">Please enter a valid email</p>
        <p :class="{disabled: !this.usedEmail}" class="help is-danger">Email is already in use</p>
      </div>

      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input v-model="form.username" class="input is-success" type="text" placeholder="Enter Username">
        </div>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input v-model="form.password" class="input is-success" type="password" placeholder="Enter Password">
        </div>
      </div>

      <div class="field">
        <label class="label">Confirm Password</label>
        <div class="control">
          <input v-model="form.password2" class="input is-success" type="password" placeholder="Enter Password Again">
        </div>
        <p :class="{disabled: pass_match}" class="help is-danger">Passwords don't match</p>
      </div>

      <div class="field">
        <div class="control">
          <button @click.prevent="submit" class="button primary">Submit</button>
        </div>
      </div>
    </form>
  `,
});