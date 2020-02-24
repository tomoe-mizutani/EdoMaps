<template>
  <div id="app">
    <Navbar/>
    <div id="map">
      <web-map/>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Navbar from "./components/Navbar.vue";
import WebMap from './components/WebMap.vue';

Vue.use(BootstrapVue)

export default {
  name: 'app',
  components: {
    WebMap,
    Navbar,
  }
}
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

#app {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  align: center;
}

#map {
  padding-top: 48px;
  height: 100vh
}
</style>
