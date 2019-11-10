<template>
  <div id="viewDiv"></div>
</template>

<script>
import { loadModules } from 'esri-loader';

export default {
  name: 'web-map',
  mounted() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/TimeSlider",], { css: true })
    .then(([ArcGISMap, MapView, FeatureLayer]) => {
      const map = new ArcGISMap({
        basemap: 'topo-vector'
      });

      this.view = new MapView({
        container: this.$el,
        map: map,
        center: [139.691706, 35.689487],
        zoom: 6
      });

      var featureLayer = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/corrected_files/FeatureServer/1?token=amsZJCL7Pvilc4_TaK7OWtWMa-lYBcGihSSYE2Fe2dxpZgtDEu-dF4WbMtcjinyT6GP92SAhQX3D4TPBuEA4EwEnmMwZGWJi7RLZfrKTReykdHmVxtBvpa-faYmq6Cf3KN1eAemT9S-H2S1qQQYwSLvTqv3M3xloA9CUaViny7Yw5yMyAoF1WoKj5iLi8fnWtc84u-W1j5QgPYRHj-7bsP2f_LkNSjNmO8f1JTiLH0pfQDvmhu7ZLwyi_TL6r88c"
      });
      map.layers.add(featureLayer);
      //
      const timeSlider = new TimeSlider({
        container: "timeSlider",
        mode: "time-window",
        view: this.view
      });
      this.view.ui.add(timeSlider, "manual");

      this.view.whenLayerView(featureLayer).then(function() {
        const fullTimeExtent = featureLayer.timeInfo.fullTimeExtent;

        // set up time slider properties
        timeSlider.fullTimeExtent = fullTimeExtent;
        timeSlider.stops = {
          interval: featureLayer.timeInfo.interval
        };
      });
    });
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
};

</script>

<style scoped>
#viewDiv {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#timeSlider {
  position: absolute;
  left: 100px;
  right: 100px;
  bottom: 30px;
}
</style>
