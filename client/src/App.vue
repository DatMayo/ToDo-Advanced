<template>
  <div id="app">
    <Login v-if="token.length === 0" />
    <ToDo v-else />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import ToDo from './components/ToDo';

export default {
  name: 'App',
  data() {
    return {
      API_URL: 'http://localhost:8181',
      id: 0,
      token: ''
    };
  },
  components: {
    Login,
    ToDo
  },
  mounted() {
    this.$nextTick(function () {
      this.id = localStorage.id;
      this.token = localStorage.token ? localStorage.token : '';
    });
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
