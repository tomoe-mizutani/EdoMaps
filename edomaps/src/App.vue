<template>
  <div id="app">
    <!-- This is a sample page with a sample embedding -->
    <!-- <h1>Map of Japan, Edo period</h1> -->
    <b-container class="bv-example-row">
      <b-row>
        <Navbar/>
      </b-row>

      <b-row id="body">
        <b-col><LeftColumn/></b-col>
        <b-col cols="9"><web-map/></b-col>
      </b-row>

      <b-row>
        <b-col>Footer?</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Navbar from "./components/Navbar.vue";
import LeftColumn from "./components/LeftColumn.vue";
import WebMap from './components/WebMap.vue';
Vue.use(BootstrapVue)

export default {
  name: 'app',
  components: {
    WebMap,
    Navbar,
    LeftColumn
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

#body {
  padding-top: 60px;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
