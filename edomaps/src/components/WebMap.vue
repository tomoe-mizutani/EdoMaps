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
      "esri/widgets/Search",
      "esri/widgets/Expand",
      "esri/widgets/BasemapGallery"
      ], { css: true })
    .then(([ArcGISMap, MapView, FeatureLayer, TimeSlider, LayerList, Legend, Search, Expand, BasemapGallery]) => {
      const map = new ArcGISMap({
        basemap: 'gray-vector'
      });

      // Instantiate the map UI using the view fature
      this.view = new MapView({
        container: this.$el,
        map: map,
        center: [139.691706, 35.689487],
        zoom: 6
      });


      // Add Gun Layer
      var gun = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/3?token=mmhhlZVuoCbYWtcVWcZ9AYOUdbomDLEBhIhLba3oMmu6qJx33R8bw-dH2d0f9W7XASmknv6VeIo4DSAvo9E2gRmaqqPxEljkvyf8ZQBRzOXeop6IruZkCdKvzIIX-QhISsuM7fNoztJbdYpnAL-Q2Au9F37giFIxaI1Z6BHG0kDLb9jUphpqxgVeNd5FOkzgogGuhIPBh8-AMTQ8RcsKHCQkxNbVG3GJZsXBMWmi1uqd4ndGnsR0Pn5riTgZEYV-"
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
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/4?token=mmhhlZVuoCbYWtcVWcZ9AYOUdbomDLEBhIhLba3oMmu6qJx33R8bw-dH2d0f9W7XASmknv6VeIo4DSAvo9E2gRmaqqPxEljkvyf8ZQBRzOXeop6IruZkCdKvzIIX-QhISsuM7fNoztJbdYpnAL-Q2Au9F37giFIxaI1Z6BHG0kDLb9jUphpqxgVeNd5FOkzgogGuhIPBh8-AMTQ8RcsKHCQkxNbVG3GJZsXBMWmi1uqd4ndGnsR0Pn5riTgZEYV-",
      });
      map.layers.add(villages_to_domains);

      // Add villages to gun
      var villages_to_gun = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/5?token=mmhhlZVuoCbYWtcVWcZ9AYOUdbomDLEBhIhLba3oMmu6qJx33R8bw-dH2d0f9W7XASmknv6VeIo4DSAvo9E2gRmaqqPxEljkvyf8ZQBRzOXeop6IruZkCdKvzIIX-QhISsuM7fNoztJbdYpnAL-Q2Au9F37giFIxaI1Z6BHG0kDLb9jUphpqxgVeNd5FOkzgogGuhIPBh8-AMTQ8RcsKHCQkxNbVG3GJZsXBMWmi1uqd4ndGnsR0Pn5riTgZEYV-",
        outfields: ["*"],
        popupTemplate: popupVillages
      });
      map.layers.add(villages_to_gun);
      
      // Create a popup template for uncertain belongings
      let popupUncertainBelongings = {
        "title": "Uncertain Belonging",
        "content": "<b>Probable 1:</b> {probable_1}<br>\
                    <b>Possible 1:</b> {possible_1}<br>\
                    <b>Start Valid:</b> {START_vali}<br>\
                    <b>End Valid:</b> {END_valid}<br>"
      }

      // Add uncertain-belonging layer
      let uncertain_belonging = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1?token=3ATb8VJxlM0Q0foAtMo0hpIGD5xuQWrlXNrCpMvc7AaOCVdVe6sG8bV55FBh-d7c5lzD9V9IzSiN6dP7-_F8Drn5cfLXVTsnbP6CRLut0Y1HpPAh-8Huba426E6NDtS7R-54pvPD-aLKRJdW2iayTIyIv4qShZkp1PmP8Ao_gP_SV2Qi3sh8Ef4ueHgD-tjOTruOYTJb3u9IsJCldmqNHOEswwxMPsRYjtqCFi-6HsTPfW-j0vDQIPgEw81TZyza",
          outfields: ["*"],
          popupTemplate: popupUncertainBelongings
      })
      map.layers.add(uncertain_belonging)

      // Crete a popup template for uncertain belongings
      let boundaryChangePopup = {
        "title": "Uncertain Belonging",
        "content": "<b>Change From 2:</b> {changefr_2}<br>\
                    <b>Change To Do:</b> {changetoDo}<br>\
                    <b>Start Valid:</b> {START_vali}<br>\
                    <b>End Valid:</b> {END_valid}<br>"
      }

      // Add boundary-changes layer
      let boundary_changes = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0?token=3ATb8VJxlM0Q0foAtMo0hpIGD5xuQWrlXNrCpMvc7AaOCVdVe6sG8bV55FBh-d7c5lzD9V9IzSiN6dP7-_F8Drn5cfLXVTsnbP6CRLut0Y1HpPAh-8Huba426E6NDtS7R-54pvPD-aLKRJdW2iayTIyIv4qShZkp1PmP8Ao_gP_SV2Qi3sh8Ef4ueHgD-tjOTruOYTJb3u9IsJCldmqNHOEswwxMPsRYjtqCFi-6HsTPfW-j0vDQIPgEw81TZyza",
          outfields: ["*"],
          popupTemplate: boundaryChangePopup
      })
      map.layers.add(boundary_changes)

      // Add the time slider widget
      const timeSlider = new TimeSlider({
        container: "timeSlider",
        mode: "instant",
        view: this.view
      });

      // Add the time slider widget
      this.view.ui.add(timeSlider, "bottom-left");

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


      /******************************************************************************************** 
       * BOTTOM RIGHT WIDGETS
      *********************************************************************************************/
      let legendExpand = new Expand({
        view: this.view,
        expandIconClass: "esri-icon-polygon",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
        expandTooltip: "View Legend", // optional, defaults to "Expand" for English locale
        group: "bottom-right",
        content: new Legend({ view: this.view,
                              layerInfos: [
                              {
                                layer: villages_to_domains, gun,
                                title: "Domains"
                              }]}),
        });        

      // Add bottom right widgets to UI
      this.view.ui.add([legendExpand], "bottom-right")
      
      /******************************************************************************************** 
       * TOP RIGHT WIDGETS
      *********************************************************************************************/

      // Setting sources property of the search widget to use two layer sources.
      var searchWidget = new Search({
        view: this.view,
        allPlaceholder: "Search Gun / Village / Kuni",
        includeDefaultSources: false,
        // autoSelect: false,
        // suggestionsEnabled: false,
        sources: [
          {
            layer: gun,
            searchFields: ["Gun_Name_R", "gun_name_K"],
            displayField: "Gun_Name_R",
            exactMatch: false,
            outFields: ["Gun_Name_R", "gun_name_K"],
            name: "Guns",
            placeholder: "Search for a Gun",
            zoomScale: 100000,
            maxSuggestions: 20,
            maxResults: 20,
          },
          {
            layer: villages_to_gun,
            searchFields: ["fukuivil_2", "fukuivil_1"],
            suggestionTemplate: "name: {fukuivil_2}<br> id: {fukuivil_1}",
            exactMatch: false,
            outFields: ["*"],
            placeholder: "Search Villages to Gun",
            name: "Villages to Gun",
            maxSuggestions: 20,
            maxResults: 20,
          },
          {
            layer: villages_to_domains,
            searchFields: ["fukuivil_3", "Village_Na"],
            displayField: "Village_Na",
            exactMatch: false,
            outFields: ["*"],
            name: "Villages to Domains",
            placeholder: "Search Villages to Domain",
            zoomScale: 10000,
            maxSuggestions: 20,
            maxResults: 20,
          },
        ]
      });

      searchWidget.on("suggest-complete", function () {
        if (searchWidget.suggestions != null) {
          searchWidget.suggestions[0].results.sort(suggestionsCompare);
        }

      });

      function suggestionsCompare(a, b) {
        if (a.text.length < b.text.length)
          return -1;
        if (a.text.length > b.text.length)
          return 1;
        return 0; // equal

      }

      // Add search widget to the top of the top-right portion of UI
      this.view.ui.add(searchWidget, "top-right");

      // Create other Expandable widgets
      let basemapExpand = new Expand({
        view: this.view,
        expandIconClass: "esri-icon-basemap",
        expandTooltip: "Select a Basemap",
        group: "top-right",
        content: new BasemapGallery({
                                      view: this.view,
                                      source: {
                                        portal: {
                                          url: "https://www.arcgis.com",
                                          useVectorBasemaps: true  // Load vector tile basemaps
                                        }}}),
      });

      let layerListExpand = new Expand({
        view: this.view,
        expandIconClass: "esri-icon-layers",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
        expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
        group: "top-right",
        content: new LayerList({
                                container: document.createElement("div"),
                                view: this.view
                              }),
      });

      this.view.ui.add([layerListExpand, basemapExpand], "top-right");

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
