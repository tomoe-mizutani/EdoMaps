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
      "esri/widgets/TimeSlider",
      "esri/widgets/LayerList",
      "esri/widgets/Legend",
      "esri/widgets/Search"
      ], { css: true })
    .then(([ArcGISMap, MapView, FeatureLayer, TimeSlider, LayerList, Legend, Search]) => {
      const map = new ArcGISMap({
        basemap: 'gray-vector'
      });

      this.view = new MapView({
        container: this.$el,
        map: map,
        center: [139.691706, 35.689487],
        zoom: 6
      });

      // Create a layer list widget
      var layerList = new LayerList({
            view: this.view
          });

      // Add widget to the top right corner of the view
      this.view.ui.add(layerList, "top-right");

      // Add Gun Layer
      var gun = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Edo_Maps_Sample_Data/FeatureServer/0?token=7mqHDHRfhfGm6kVOqK-Mw9RafgjEkvcBi9TgbSZKY_DJ8h13Z27guBsBJZrI7Q7tTxFB8uWui-VAKx1Kn97-QeEDtFqgBLAWx2J-VPlcyOV7nsB37gEsylar89NYGi6nxEHd5_PhwWip9Lahs0mfhmiKwiehj2BB3PM0pzC2jHewEfkSapxjjxkkYZ97IoVDD13nEQgHR16x04jRrxDsDfMJWKYdW0S-Kc3ULo_AZt3Ga1dHAlVl8a3xkX2qXmp6"
      });
      map.layers.add(gun);

      let content_string = "<b>Gun Name Kanji:</b> {gun_name_K}<br>\
                            <b>Gun Name Romaji:</b> {gun_name_R}<br>\
                            <b>Kuni Name:</b> {Kuni_name_}<br>\
                            <b>Kuni Name (Romaji):</b> {Kuni_name1}<br>\
                            <b>Start Valid:</b> {START_VALI}<br>\
                            <b>End Valid:</b> {END_VALID}"

      // Create a popup template for villages from gun:
      let popupVillages = {
        "title": "{fukuivil_2}",
        "content": content_string,
      }

      // Add villages to domains
      var villages_to_domains = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Edo_Maps_Sample_Data/FeatureServer/1?token=7mqHDHRfhfGm6kVOqK-Mw9RafgjEkvcBi9TgbSZKY_DJ8h13Z27guBsBJZrI7Q7tTxFB8uWui-VAKx1Kn97-QeEDtFqgBLAWx2J-VPlcyOV7nsB37gEsylar89NYGi6nxEHd5_PhwWip9Lahs0mfhmiKwiehj2BB3PM0pzC2jHewEfkSapxjjxkkYZ97IoVDD13nEQgHR16x04jRrxDsDfMJWKYdW0S-Kc3ULo_AZt3Ga1dHAlVl8a3xkX2qXmp6",
      });
      map.layers.add(villages_to_domains);

      // Add villages to gun
      var villages_to_gun = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Edo_Maps_Sample_Data/FeatureServer/2?token=7mqHDHRfhfGm6kVOqK-Mw9RafgjEkvcBi9TgbSZKY_DJ8h13Z27guBsBJZrI7Q7tTxFB8uWui-VAKx1Kn97-QeEDtFqgBLAWx2J-VPlcyOV7nsB37gEsylar89NYGi6nxEHd5_PhwWip9Lahs0mfhmiKwiehj2BB3PM0pzC2jHewEfkSapxjjxkkYZ97IoVDD13nEQgHR16x04jRrxDsDfMJWKYdW0S-Kc3ULo_AZt3Ga1dHAlVl8a3xkX2qXmp6",
        outfields: ["fukuivil_2", "gun_name_K", "gun_name_R", "Kuni_name_", "Kuni_name1", "START_VALI", "END_VALID"],
        popupTemplate: popupVillages
      });
      map.layers.add(villages_to_gun);
      

      // Add the time slider widget
      const timeSlider = new TimeSlider({
        container: "timeSlider",
        mode: "time-window",
        view: this.view
      });
      this.view.ui.add(timeSlider, "manual");

      // Add a legend for the villages to domains view
      var legend = new Legend({
          view: this.view,
          layerInfos: [
            {
              layer: villages_to_domains,
              title: "Domains"
            }
          ]
        });


      // Setting sources property of the search widget to use two layer sources.
      var searchWidget = new Search({
        view: this.view,
        allPlaceholder: "Search Gun / Village / Kuni",
        sources: [
          {
            layer: gun,
            searchFields: ["Gun_Name_R", "gun_name_K"],
            displayField: "Gun_Name_R",
            exactMatch: false,
            outFields: ["Gun_Name_R", "gun_name_K"],
            name: "Guns",
            placeholder: "WHERE does gun placeholder go.",
            zoomScale: 100000,
          },
          {
            layer: villages_to_gun,
            searchFields: ["fukuivil_2"],
            suggestionTemplate: "{fukuivil_2}",
            exactMatch: false,
            outFields: ["*"],
            placeholder: "eWHERE does villages placeholder go",
            name: "Villages to Gun",
            zoomScale: 500000,
            // resultSymbol: {
            //   type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            //   url: "images/senate.png",
            //   height: 36,
            //   width: 36
            // }
          }
        ]
      });

      // Add search widget
      this.view.ui.add(searchWidget, "bottom-left");

      // Add widget to the bottom right corner of the view
      this.view.ui.add(legend, "bottom-right");
      

      this.view.whenLayerView(villages_to_domains).then(function() {
        const fullTimeExtent = villages_to_domains.timeInfo.fullTimeExtent;

        // set up time slider properties
        timeSlider.fullTimeExtent = fullTimeExtent;
        timeSlider.stops = {
          interval: {
            value: 1,
            unit: "years"
          }
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
