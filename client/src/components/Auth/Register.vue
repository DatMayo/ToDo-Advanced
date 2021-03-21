<template>
  <div id="register">
    <h3>Register</h3>
    <div class="alert alert-danger text-start" role="alert" v-if="errors.length > 0">
      There are some errors:
      <ul>
        <li v-for="error in errors" :key="error.id">{{ error.msg }}</li>
      </ul>
    </div>
    <form action="POST">
      <div class="row mb-3">
        <label for="registerUsername" class="col-sm-2 col-form-label">Username</label>
        <div class="col-sm10">
          <input
            type="text"
            class="form-control"
            id="registerUsername"
            v-model="username"
            placeholder="jane.doe"
            :disabled="disabled"
            @keydown.prevent.enter="doRegister"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="registerPassword" class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm10">
          <input
            type="password"
            name=""
            id="registerPassword"
            class="form-control"
            v-model="password"
            placeholder="password"
            :disabled="disabled"
            @keydown.prevent.enter="doRegister"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="registerPasswordConfirm" class="col-sm-2 col-form-label">Retype</label>
        <div class="col-sm10">
          <input
            type="password"
            name=""
            id="registerPasswordConfirm"
            class="form-control"
            v-model="passwordConfirm"
            placeholder="password"
            :disabled="disabled"
            @keydown.prevent.enter="doRegister"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <button class="btn btn-secondary signinBtn" @click.prevent="$parent.showLogin = true" :disabled="disabled">
            Have Account?
          </button>
        </div>
        <div class="col-sm">
          <button type="submit" class="btn btn-primary registerBtn" @click.prevent="doRegister" :disabled="disabled">
            Register
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      disabled: false,
      username: '',
      password: '',
      passwordConfirm: '',
      errors: []
    };
  },
  methods: {
    doRegister: async function () {
      this.errors = [];
      if (this.username == '') this.errors.push({ msg: 'Please enter a username' });
      if (this.password == '') this.errors.push({ msg: 'Please enter a password' });
      if (this.passwordConfirm == '') this.errors.push({ msg: 'Please enter a password confirmation' });
      if (this.errors.length > 0) return;
      this.disabled = true;
      this.axios
        .post(
          `${this.$parent.API_URL}/account/register`,
          {
            username: this.username,
            password: this.password,
            passwordConfirm: this.passwordConfirm
          },
          { timeout: 500 }
        )
        .then((res) => {
          this.login.username = this.username;
          this.login.successMessage = res.data.Success.msg;
          this.showLogin = true;
        })
        .catch((err) => {
          if (err.code === 'ECONNABORTED')
            return this.errors.push({ msg: 'Could not reach server, please try again later' });
          for (const error of err.response.data.Error) this.errors.push(error);
        })
        .finally(() => {
          this.disabled = false;
        });
    }
  }
};
</script>

<style scoped></style>
