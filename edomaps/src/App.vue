<template>
  <div id="app">
    <!-- This is a sample page with a sample embedding -->
    <h1>Map of Japan, Edo period</h1>
    <div class="embed-container"><small><a href="//yalemaps.maps.arcgis.com/apps/Embed/index.html?webmap=99b82cf066904c2d8cd2eeac13856609&extent=-132.3413,20.4201,-46.2085,58.0972&home=true&zoom=true&scale=true&search=true&searchextent=true&details=true&legendlayers=true&active_panel=details&disable_scroll=true&theme=light" style="color:#0000FF;text-align:left" target="_blank">View larger map</a></small><br><iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Something" src="//yalemaps.maps.arcgis.com/apps/Embed/index.html?webmap=99b82cf066904c2d8cd2eeac13856609&extent=-132.3413,20.4201,-46.2085,58.0972&home=true&zoom=true&previewImage=false&scale=true&search=true&searchextent=true&details=true&legendlayers=true&active_panel=details&disable_scroll=true&theme=light"></iframe></div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  align: center;
}

.embed-container {
  position: relative;
  padding-bottom: 80%;
  height: 0;
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
}
.embed-container iframe, .embed-container object,
.embed-container iframe{
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}
small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}
</style>
