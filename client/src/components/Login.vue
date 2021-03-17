<template>
  <div class="container">
    <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm-6">
        <div id="login" v-if="showLogin">
          <h3>Login</h3>
          <div class="alert alert-success" role="alert" v-if="login.successMessage.length > 0">
            {{ login.successMessage }}
          </div>
          <div class="alert alert-danger text-start" role="alert" v-if="login.errors.length > 0">
            There are some errors:
            <ul>
              <li v-for="error in login.errors" :key="error.id">{{ error.msg }}</li>
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
                  v-model="login.username"
                  placeholder="jane.doe"
                  @keydown.prevent.enter="doLogin"
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
                  v-model="login.password"
                  placeholder="password"
                  ref="password"
                  @keydown.prevent.enter="doLogin"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <button class="btn btn-secondary registerBtn" @click.prevent="showLogin = false">No Account?</button>
              </div>
              <div class="col-sm">
                <button type="submit" class="btn btn-primary signinBtn" @click.prevent="doLogin">Sign in</button>
              </div>
            </div>
          </form>
        </div>
        <div id="register" v-else>
          <h3>Register</h3>
          <div class="alert alert-danger text-start" role="alert" v-if="register.errors.length > 0">
            There are some errors:
            <ul>
              <li v-for="error in register.errors" :key="error.id">{{ error.msg }}</li>
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
                  v-model="register.username"
                  placeholder="jane.doe"
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
                  v-model="register.password"
                  placeholder="password"
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
                  v-model="register.passwordConfirm"
                  placeholder="password"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <button class="btn btn-secondary signinBtn" @click.prevent="showLogin = true">Have Account?</button>
              </div>
              <div class="col-sm">
                <button type="submit" class="btn btn-primary registerBtn" @click.prevent="doRegister">Register</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      login: {
        username: '',
        password: '',
        errors: [],
        successMessage: ''
      },
      register: {
        username: '',
        password: '',
        passwordConfirm: '',
        errors: []
      },
      showLogin: true
    };
  },
  methods: {
    clearMessages: function () {
      this.login.successMessage = '';
      this.login.errors = [];
      this.register.errors = [];
    },
    doLogin: function () {
      this.clearMessages();
      if (this.login.username == '') this.login.errors.push({ msg: 'Please enter a username' });
      if (this.login.password == '') this.login.errors.push({ msg: 'Please enter a password' });
      if (this.login.errors.length > 0) return;
      this.axios
        .post(`${this.$parent.API_URL}/account/login`, {
          username: this.login.username,
          password: this.login.password
        })
        .then((res) => {
          this.$parent.id = res.data.Data.id;
          this.$parent.token = res.data.Data.tokenId;
          localStorage.setItem('id', res.data.Data.id);
          localStorage.setItem('token', res.data.Data.tokenId);
        })
        .catch((err) => {
          for (const error of err.response.data.Error) this.login.errors.push(error);
        });
    },
    doRegister: async function () {
      this.clearMessages();
      if (this.register.username == '') this.register.errors.push({ msg: 'Please enter a username' });
      if (this.register.password == '') this.register.errors.push({ msg: 'Please enter a password' });
      if (this.register.passwordConfirm == '')
        this.register.errors.push({ msg: 'Please enter a password confirmation' });
      if (this.register.errors.length > 0) return;
      this.axios
        .post(`${this.$parent.API_URL}/account/register`, {
          username: this.register.username,
          password: this.register.password,
          passwordConfirm: this.register.passwordConfirm
        })
        .then((res) => {
          this.login.username = this.register.username;
          this.login.successMessage = res.data.Success.msg;
          this.showLogin = true;
        })
        .catch((err) => {
          for (const error of err.response.data.Error) this.register.errors.push(error);
        });
    }
  },
  mounted() {
    this.$nextTick(function () {
      // console.log(this.$parent.API_URL);
    });
  },
  props: {}
};
</script>

<style scoped>
ul {
  margin-bottom: 0;
}

#login,
#register {
  border: 1px solid #dee2e6;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  padding: 1.5rem;
}
.signinBtn,
.registerBtn {
  width: 100%;
}
.container {
  margin-top: 5em;
}
</style>
