<template>
  <div id="login">
    <h3>Login</h3>
    <div class="alert alert-success" role="alert" v-if="successMessage.length > 0">
      {{ login.successMessage }}
    </div>
    <div class="alert alert-danger text-start" role="alert" v-if="errors.length > 0">
      There are some errors:
      <ul>
        <li v-for="error in errors" :key="error.id">{{ error.msg }}</li>
      </ul>
    </div>
    <form action="POST">
      <div class="row mb-3">
        <label for="loginUsername" class="col-sm-2 col-form-label">Username</label>
        <div class="col-sm10">
          <input
            type="text"
            class="form-control"
            id="loginUsername"
            v-model="username"
            placeholder="jane.doe"
            @keydown.prevent.enter="doLogin"
            :disabled="disabled"
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="loginPassword" class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm10">
          <input
            type="password"
            name=""
            id="loginPassword"
            class="form-control"
            v-model="password"
            placeholder="password"
            ref="password"
            @keydown.prevent.enter="doLogin"
            :disabled="disabled"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <button class="btn btn-secondary registerBtn" @click.prevent="$parent.showLogin = false" :disabled="disabled">
            No Account?
          </button>
        </div>
        <div class="col-sm">
          <button type="submit" class="btn btn-primary signinBtn" @click.prevent="doLogin" :disabled="disabled">
            Sign in
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      disabled: false,
      username: '',
      password: '',
      errors: [],
      successMessage: ''
    };
  },
  methods: {
    doLogin: function () {
      this.errors = [];
      if (this.username == '') this.errors.push({ msg: 'Please enter a username' });
      if (this.password == '') this.errors.push({ msg: 'Please enter a password' });
      if (this.errors.length > 0) return;
      this.disabled = true;
      this.axios
        .post(
          `${this.$parent.API_URL}/account/login`,
          {
            username: this.username,
            password: this.password
          },
          { timeout: 500 }
        )
        .then((res) => {
          this.$parent.$parent.token = res.data.Data.tokenId;
          localStorage.setItem('token', res.data.Data.tokenId);
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
