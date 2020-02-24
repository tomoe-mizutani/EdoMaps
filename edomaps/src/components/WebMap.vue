<template>
  <div id="viewDiv">
    <screenshot :view="view" />
  </div>
</template>

<script>

import { loadModules } from 'esri-loader';
import Screenshot from './Screenshot.vue';

export default {
  name: 'web-map',
  components: {
    Screenshot, 
  },
  data(){
    return{
      view: null,
      isMounted: false,
    }
  },
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
      "esri/widgets/BasemapGallery",
      "esri/widgets/Print",
      "esri/widgets/Print/TemplateOptions",
      ], { css: true })
    .then(([ArcGISMap, MapView, FeatureLayer, TimeSlider, LayerList, Legend, Search, Expand, BasemapGallery, Print, TemplateOptions]) => {
      const map = new ArcGISMap({
        basemap: 'gray-vector'
      });

      // Instantiate the map UI using the view fature
      this.view = new MapView({
        container: this.$el,
        map: map,
        center: [139.691706, 35.689487],
        zoom: 6,
        // scale: 4155583.4197442674,
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
        symbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [51, 51, 204, 0.9],
          style: "solid",
          outline: {  // autocasts as new SimpleLineSymbol()
            color: "black",
            width: 1
          }
        }
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
        popupTemplate: popupUncertainBelongings,
      })
      map.layers.add(uncertain_belonging)

      /* =====================================================================================================
                                  CODE TO FOR CROSS HATCHING TO WORK
      =======================================================================================================*/

      // Symbol for FUKUI / OONO
      const FukuiOono = {
        type: "picture-fill",
        url: "http://localhost:3000/red_yellow.jpg",
        width: 500,
        height: 500
      };

      // Symbol for SABE / FUKUI
      const SabaeFukui = {
        type: "picture-fill",
        url: "http://localhost:3000/red_green.jpg",
        width: 500,
        height: 500
      };

      // Symbol for all others
      const otherSym = {
        type: "simple-fill",
        // style: "square",
        // size: 18,
        color: [26, 26, 26, 1]
      };

      // Create a renderer to render specific symbols on top of Boundaries layer
      const boundaryRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        legendOptions: {
          title: "Uncertanties:"
        },
        defaultSymbol: otherSym,
        defaultLabel: "DEFAULT LABEL",
        field: "changefr_2",
        field2: "changetoDo",
        fieldDelimiter: ", ",
        uniqueValueInfos: [
          {
            value: "Fukui, Oono", // code for fukui to oono boundaries
            symbol: FukuiOono,
            label: "Fukui to Oono"
          },
          {
            value: "Sabae, Fukui", // code for sabae to fukui boundaries
            symbol: SabaeFukui,
            label: "Sabae to Fukui"
          }
        ]
      };

      // Crete a popup template for uncertain boundaries
      let boundaryChangePopup = {
        "title": "Boundary Change",
        "content": "<b>Change From 2:</b> {changefr_2}<br>\
                    <b>Change To Do:</b> {changetoDo}<br>\
                    <b>Start Valid:</b> {START_vali}<br>\
                    <b>End Valid:</b> {END_valid}<br>"
      }

      // Add boundary-changes layer
      let boundary_changes = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0?token=3ATb8VJxlM0Q0foAtMo0hpIGD5xuQWrlXNrCpMvc7AaOCVdVe6sG8bV55FBh-d7c5lzD9V9IzSiN6dP7-_F8Drn5cfLXVTsnbP6CRLut0Y1HpPAh-8Huba426E6NDtS7R-54pvPD-aLKRJdW2iayTIyIv4qShZkp1PmP8Ao_gP_SV2Qi3sh8Ef4ueHgD-tjOTruOYTJb3u9IsJCldmqNHOEswwxMPsRYjtqCFi-6HsTPfW-j0vDQIPgEw81TZyza",
        renderer: boundaryRenderer,
        outfields: ["*"],
        popupTemplate: boundaryChangePopup,
      })
      map.layers.add(boundary_changes)

      /* =====================================================================================================
                                  END OF CODE FOR CROboSS HATCHING
      =======================================================================================================*/
    
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
          },
        };
        timeSlider.values =  [
          new Date(1700, 0, 1) // Initialize the current time for the beginning of the fullTimeExtent.
        ]
      });

      // // watch current time
      // timeSlider.watch("values", function(values){
      //   console.log("The current time is: ", values[0]);
      // });

      /********************************************************************************************
       * BOTTOM RIGHT WIDGETS
      *********************************************************************************************/

      // LEGEND WIDGET
      this.legendExpand = new Expand({
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
  
      // EXPORT WIDGET
      // let printTemplate = new printTemplate({
      //   layoutOptions: {
      //     titleText: "My Print",
      //     authorText: "Sam",
      //     copyrightText: "My Company",
      //     scalebarUnit: "Miles",
      //     // the following text elements must
      //     // exist in the print service to appear
      //     customTextElements: [
      //       {"description": "My description"},
      //       {"location": "My Location"},
      //       {"date": "11/11/2020, 11:11:20 AM"}
      //     ]
      //   }
      // });
      let exportExpand = new Expand({
        view: this.view,
        expandIconClass: "esri-icon-printer",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
        expandTooltip: "Export Map", // optional, defaults to "Expand" for English locale
        group: "bottom-right",
        content: new Print({
          view: this.view,
          templateOptions: new TemplateOptions({
            title: "My Print",
            author: "Sam",
            copyright: "My Company",
            legendEnabled: true
            // the following text elements must
            // exist in the print service to appear
            // customTextElements: [
            //   {"description": "My description"},
            //   {"location": "My Location"},
            //   {"date": "11/11/2020, 11:11:20 AM"}
            // ]
          }),
          printServiceUrl:
                "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
          })
      });

      // Add bottom right widgets to UI
      this.view.ui.add([this.legendExpand, exportExpand], "bottom-right")
      // this.legends = legendExpand

      /********************************************************************************************
       * TOP RIGHT WIDGETS
      *********************************************************************************************/

      // Setting sources property of the search widget to use two layer sources.
      var searchWidget = new Search({
        view: this.view,
        allPlaceholder: "Search Gun / Village / Kuni",
        includeDefaultSources: false,
        group: "top-right",
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
            suggestionTemplate: "name: {fukuivil_2}<br> {fukuivil_3}-{fukuivil_4}",
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

      this.view.ui.add([searchWidget, layerListExpand, basemapExpand], "top-right");
      

      // TEST CODE //
      var data = new URLSearchParams();
      data.append('Web_Map_as_JSON', JSON.stringify({"operationalLayers":[{"type":"VectorTileLayer","styleUrl":"https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json","id":"gray-base-layer","title":"World Light Gray","opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/3","id":"1706e5bdfb5-layer-5","title":"Files v4 - Gun","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/4","id":"1706e5bdfb5-layer-6","opacity":0.8,"title":"Files v4 - Villages to domains","showLabels":true,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1","id":"1706e5bdfb5-layer-8","title":"Overlays - Uncertainbelonging","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0","id":"1706e5bdfb5-layer-9","title":"Overlays - Boundarychanges","layerDefinition":{"drawingInfo":{"renderer":{"type":"uniqueValue","field1":"changefr_2","field2":"changetoDo","legendOptions":{"title":"Uncertanties:"},"defaultLabel":"DEFAULT LABEL","defaultSymbol":{"type":"esriSFS","color":[26,26,26,255],"outline":{"type":"esriSLS","color":[0,0,0,255],"width":0.75,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"fieldDelimiter":", ","uniqueValueInfos":[{"label":"Fukui to Oono","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_yellow.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Fukui, Oono"},{"label":"Sabae to Fukui","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_green.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Sabae, Fukui"}]}}},"showLabels":true,"opacity":1,"minScale":0,"maxScale":0}],"mapOptions":{"extent":{"spatialReference":{"latestWkid":3857,"wkid":102100},"xmin":14975258.010328524,"ymin":4223777.491982939,"xmax":15205181.051256388,"ymax":4429546.383664394},"spatialReference":{"latestWkid":3857,"wkid":102100},"showAttribution":true,"scale":1155583.4197442674,"time": [-8488800000000]},"exportOptions":{"dpi":96},"layoutOptions":{"titleText":"My Print","authorText":"Sam","copyrightText":"My Company","scaleBarOptions":{},"legendOptions":{"operationalLayers":[{"id":"1706e5bdfb5-layer-5"},{"id":"1706e5bdfb5-layer-6"},{"id":"1706e5bdfb5-layer-8"},{"id":"1706e5bdfb5-layer-9"}]}}}))
      data.append('Format', 'PDF')
      data.append('Layout_Template', 'Letter ANSI A Landscape')
      data.append('returnFeatureCollection', 'false')
      data.append('returnM', 'false')
      data.append('returnZ', 'false')
      data.append('f', 'json')

      var url = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute"
      // formData = JSON.stringify({"Web_Map_as_JSON":{"operationalLayers":[{"type":"VectorTileLayer","styleUrl":"https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json","id":"gray-base-layer","title":"World Light Gray","opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/3","id":"1706e5bdfb5-layer-5","title":"Files v4 - Gun","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/4","id":"1706e5bdfb5-layer-6","opacity":0.8,"title":"Files v4 - Villages to domains","showLabels":true,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1","id":"1706e5bdfb5-layer-8","title":"Overlays - Uncertainbelonging","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0","id":"1706e5bdfb5-layer-9","title":"Overlays - Boundarychanges","layerDefinition":{"drawingInfo":{"renderer":{"type":"uniqueValue","field1":"changefr_2","field2":"changetoDo","legendOptions":{"title":"Uncertanties:"},"defaultLabel":"DEFAULT LABEL","defaultSymbol":{"type":"esriSFS","color":[26,26,26,255],"outline":{"type":"esriSLS","color":[0,0,0,255],"width":0.75,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"fieldDelimiter":", ","uniqueValueInfos":[{"label":"Fukui to Oono","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_yellow.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Fukui, Oono"},{"label":"Sabae to Fukui","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_green.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Sabae, Fukui"}]}}},"showLabels":true,"opacity":1,"minScale":0,"maxScale":0}],"mapOptions":{"extent":{"spatialReference":{"latestWkid":3857,"wkid":102100},"xmin":14975258.010328524,"ymin":4223777.491982939,"xmax":15205181.051256388,"ymax":4429546.383664394},"spatialReference":{"latestWkid":3857,"wkid":102100},"showAttribution":true,"scale":1155583.4197442674},"exportOptions":{"dpi":96},"layoutOptions":{"titleText":"My Print","authorText":"Sam","copyrightText":"My Company","scaleBarOptions":{},"legendOptions":{"operationalLayers":[{"id":"1706e5bdfb5-layer-5"},{"id":"1706e5bdfb5-layer-6"},{"id":"1706e5bdfb5-layer-8"},{"id":"1706e5bdfb5-layer-9"}]}}}})
      
      fetch(url, {
        method: 'POST',
        body: data,
      })
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        console.log(myJson.results[0].value.url);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      this.isMounted = true;
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
#map {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
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
