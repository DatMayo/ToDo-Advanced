<template>
  <div class="container">
    <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm">
        <div id="login" v-if="showLogin">
          <h3>Login</h3>
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
                  placeholder="secure-password"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <button class="btn btn-secondary registerBtn" @click.prevent="showLogin = false">Register</button>
              </div>
              <div class="col-sm"></div>
              <div class="col-sm">
                <button type="submit" class="btn btn-primary signinBtn" @click.prevent="">Sign in</button>
              </div>
            </div>
          </form>
        </div>
        <div id="register" v-else>
          <h3>Register</h3>
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
                  placeholder="secure-password"
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
                  placeholder="secure-password"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <button class="btn btn-secondary signinBtn" @click.prevent="showLogin = true">Login</button>
              </div>
              <div class="col-sm"></div>
              <div class="col-sm">
                <button type="submit" class="btn btn-primary registerBtn" @click.prevent="">Register</button>
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
        password: ''
      },
      register: {
        username: '',
        password: '',
        passwordConfirm: ''
      },
      showLogin: true
    };
  },
  methods: {
    doLogin: function () {
      // ToDo
    },
    doRegister: function () {
      // ToDo
    }
  },
  props: {}
};
</script>

<style scoped>
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
</style>
