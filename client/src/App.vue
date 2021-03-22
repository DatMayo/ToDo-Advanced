<template>
  <div id="app">
    <Auth v-if="token.length === 0" :API_URL="API_URL" />
    <ToDo v-else :API_URL="API_URL" />
  </div>
</template>

<script>
import Auth from './components/Auth/Auth.vue';
import ToDo from './components/ToDo/ToDo.vue';

export default {
  name: 'App',
  data() {
    return {
      API_URL: 'http://localhost:8181',
      token: ''
    };
  },
  components: {
    Auth,
    ToDo
  },
  mounted() {
    this.$nextTick(function () {
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
