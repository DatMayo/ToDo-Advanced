<template>
  <div class="container">
    <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm-6">
        <Login v-if="showLogin" />
        <Register v-else />
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
import Login from './Login';
import Register from './Register';

export default {
  name: 'auth',
  components: {
    Login,
    Register
  },
  data() {
    return {
      showLogin: true
    };
  },
  props: ['API_URL']
};
</script>

<style>
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
