<template>
<div id="map">
  <div class="vld-parent" id="loadScreen"> 
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading> 
  </div>
   <div id="mapView">
    <screenshot :view="view" />
    <navbar @changeSettings="updateFilter"></navbar>
  </div>
</div>
</template>

<script>
import { loadModules } from 'esri-loader';
import Screenshot from './Screenshot.vue';
import Navbar from './Navbar.vue';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'web-map',
  components: {
    Screenshot, 
    Navbar,
    Loading,
  },
  data(){
    return{
      isLoading: true,
      fullPage: true,
      view: null,
      isMounted: false,
      preferences: {
        domains: {
          branch: '',
          uncertainty: '',
          styling: '',
        },
        villages: '',
        guns: '',
      },
      layers:{
        villages: null,
        villageBoundaries: null,
        guns: null,
        kunis: null,
        domains: null,
      },
    }
  },
        
  methods: {
    updateStyling(style){
      if (style == "Daimyo status"){
        console.log("Update daiyo tatus")
        this.layers.domains.renderer = {
          type: "unique-value",  // autocasts as new UniqueValueRenderer()
          field: "Dump_Domain_status_RJ",
          defaultSymbol: { type: "simple-fill" },  
          uniqueValueInfos: [{
            value: "Shinpan",
            symbol: {
              type: "simple-fill",  
              color: "#5096D0"
            }
          }, {
            value: "Tozama",
            symbol: {
              type: "simple-fill",  
              color: "#D05150"
            }
          }, {
            value: "Fudai",
            symbol: {
              type: "simple-fill",  
              color: "#50D0A0"
            }
          }],
        };
      }
    },
    updateFilter(form){
      // const domainLabelClass = {  // autocasts as new LabelClass()
      //   symbol: {
      //     type: "text",  // autocasts as new TextSymbol()
      //     color: "pink",
      //     haloColor: "white",
      //     haloSize: 1,
      //     font: {  // autocast as new Font()
      //       family: "Ubuntu Mono",
      //       size: 13,
      //       weight: "bold"
      //     }
      //   },
      //   labelPlacement: "above-right",
      //   labelExpressionInfo: {
      //     expression: "$feature.Dump_Domain_Domain_KJ"
      //   },
      //   maxScale: 0,
      //   minScale: 2500000,
      // };
      // this.layers.domains.labelingInfo = [domainLabelClass];

      var domainForm = form.domains;
      var villageForm = form.villages;
      var gunForm = form.guns;

      var domainBranchSql = ""
      var domainUncertaintySql = ""

      if (domainForm.styling != this.preferences.domains.styling){
        this.updateStyling(domainForm.styling);
      }

      // handle domains
      if (domainForm.branch != this.preferences.domains.branch || domainForm.uncertainty != this.preferences.domains.uncertainty){
        if (domainForm.branch == "Branch"){
          domainBranchSql = "Dump_Domain_DomSize = 'Regular' OR Dump_Domain_DomSize = 'Branch' OR Dump_Domain_DomSize = 'MainBranch'"
        } else {
          domainBranchSql = "Dump_Domain_DomSize = 'Regular' OR Dump_Domain_DomSize = 'Main'"
        }

        if (domainForm.uncertainty == "Newcomer"){
          domainUncertaintySql = "Dump_Domain_NI_Situation = 'Regular' OR Dump_Domain_NI_Situation = 'Newcomer'"
        } else {
          domainUncertaintySql = "Dump_Domain_NI_Situation = 'Regular' OR Dump_Domain_NI_Situation = 'Incumbent'"
        }

        var domainSql = domainBranchSql + " AND " + domainUncertaintySql
        console.log(domainSql)

        this.view.whenLayerView(this.layers.domains).then(function(featureLayerView) {
          featureLayerView.filter = {
            where: domainSql
          };
        });
        this.preferences.domains.branch = domainForm.branch;
      }
      
      var villageSql = ""
      // handle villages
      if (villageForm == "Small"){
        villageSql =  "Dump_Villages_SIZE = 'Regular' OR Dump_Villages_SIZE = 'Small'"
      } else {
        villageSql =  "Dump_Villages_SIZE = 'Regular' OR Dump_Villages_SIZE = 'Large'"
      }

      this.view.whenLayerView(this.layers.villageBoundaries).then(function(featureLayerView) {
        featureLayerView.filter = {
          where: villageSql
        };
      });
      this.view.whenLayerView(this.layers.villages).then(function(featureLayerView) {
        featureLayerView.filter = {
          where: villageSql
        };
      });

      // handle gun 
      var gunSql = ""
      if (gunForm == "Small"){
        gunSql = "Dump_Gun_SIZE = 'Regular' OR Dump_Gun_SIZE = 'Small'"
      } else {
        gunSql = "Dump_Gun_SIZE = 'Regular' OR Dump_Gun_SIZE = 'Lumped'"
      }

      this.view.whenLayerView(this.layers.guns).then(function(featureLayerView) {
        featureLayerView.filter = {
          where: gunSql
        };
      });
    },
  },
  mounted() {
    this.isLoading = true;
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
      "esri/layers/GroupLayer",
      ], { css: true })
    .then(([ArcGISMap, MapView, FeatureLayer, TimeSlider, LayerList, Legend, Search, Expand, BasemapGallery, Print, TemplateOptions, GroupLayer]) => {
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
      // map.layers.add(gun);

      let content_string = "<b>Gun Name Kanji:</b> {gun_name_K}<br>\
                            <b>Gun Name Romaji:</b> {gun_name_R}<br>\
                            <b>Kuni Name:</b> {Kuni_name_}<br>\
                            <b>Kuni Name (Romaji):</b> {Kuni_name1}<br>\
                            <b>Start Valid:</b> {START_VALI}<br>\
                            <b>End Valid:</b> {END_VALID}"

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
      // map.layers.add(villages_to_domains);

      // Add villages to gun
      var villages_to_gun = new FeatureLayer({
        url:
          "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/5?token=mmhhlZVuoCbYWtcVWcZ9AYOUdbomDLEBhIhLba3oMmu6qJx33R8bw-dH2d0f9W7XASmknv6VeIo4DSAvo9E2gRmaqqPxEljkvyf8ZQBRzOXeop6IruZkCdKvzIIX-QhISsuM7fNoztJbdYpnAL-Q2Au9F37giFIxaI1Z6BHG0kDLb9jUphpqxgVeNd5FOkzgogGuhIPBh8-AMTQ8RcsKHCQkxNbVG3GJZsXBMWmi1uqd4ndGnsR0Pn5riTgZEYV-",
        outfields: ["*"],
        popupTemplate: popupVillages
      });
      // map.layers.add(villages_to_gun);

      // Create a popup template for villages from gun:
      let popupVillages = {
        "title": "{fukuivil_2}",
        "content": content_string,
      }
      const villageLabelClass = {  // autocasts as new LabelClass()
        symbol: {
          type: "text",  // autocasts as new TextSymbol()
          color: "grey",
          haloColor: "white",
          haloSize: 1,
          font: {  // autocast as new Font()
            family: "Ubuntu Mono",
            size: 12,
            // weight: "bold"
          }
        },
        labelPlacement: "above-right",
        labelExpressionInfo: {
          expression: "$feature.Dump_Villages_VID"
        },
        maxScale: 0,
        minScale: 250000,
      };
      var villageTemplate = {
          "title": "TITLE: {Dump_Villages_VID}",
          "content": "{Dump_Villages_SIZE}",
      };

      var villages = new FeatureLayer({
        url:
          "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_villages/MapServer/0",
        outfields: ["*"],
        title: "Fill",
        minScale: 1000000,
        popupTemplate: villageTemplate,
        labelingInfo:[villageLabelClass],
      });

      villages.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-fill",  
          size: 6,
          color: "lightblue",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white"
          }
        }
      };
  
      this.layers.villages = villages;

      var villageBoundaries = new FeatureLayer({
        url:
          "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_villages/MapServer/0",
        outfields: ["*"],
        title: "Boundary",
        minScale: 1000000,
        popupTemplate: villageTemplate,
        visible: false,
      });
      
      villageBoundaries.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-line",  
          size: 6,
          color: "pink",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "black"
          }
        }
      };
      this.layers.villageBoundaries = villageBoundaries;

      // var villageGroupLayer = new GroupLayer({
      //   title: "Villages",
      //   visible: true,
      //   // visibilityMode: "exclusive",
      //   layers: [villages, villageBoundaries],
      //   opacity: 0.85,
      // });
      // map.layers.add(villageGroupLayer);

      var gunTemplate = {
          "title": "Gun name: {Dump_Gun_GID}",
          "content": "{Dump_Gun_SIZE}",
      };

      var guns = new FeatureLayer({
        url:
          "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_gun/MapServer/0",
        outfields: ["*"],
        title: "Gun",
        minScale: 1000000,
        opacity: 0.75,
        popupTemplate: gunTemplate,
        visible: false,
      });
      map.layers.add(guns);
      this.layers.guns = guns;
      
      var kuniTemplate = {
          "title": "Kuni name: {Dump_Gun_KID}",
      };
    
      var kunis = new FeatureLayer({
        url:
          "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_kuni/MapServer/0",
        outfields: ["*"],
        title: "Kuni",
        minScale: 1000000,
        opacity: 0.75,
        popupTemplate: kuniTemplate,
        visible: false,
      });
      // map.layers.add(kunis);
      this.layers.kunis = kunis;

      const domainLabelClass = {  // autocasts as new LabelClass()
        symbol: {
          type: "text",  // autocasts as new TextSymbol()
          color: "grey",
          haloColor: "white",
          haloSize: 1,
          font: {  // autocast as new Font()
            family: "Ubuntu Mono",
            size: 13,
            weight: "bold"
          }
        },
        labelPlacement: "above-right",
        labelExpressionInfo: {
          expression: "$feature.Dump_Domain_Domain_KJ"
        },
        maxScale: 0,
        minScale: 2500000,
        // where: "Conference = 'AFC'"
      };

      var domainTemplate = {
          "title": "Domain name: {Dump_Domain_Domain_KJ}",
          "content": "{Dump_Domain_status_RJ}" ,
      };
      var domains = new FeatureLayer({
        url:
          "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_domains/MapServer/0",
        outfields: ["*"],
        title: "Domains",
        minScale: 1000000,
        opacity: 0.75,
        popupTemplate: domainTemplate,
        labelingInfo: [domainLabelClass],
      });
      this.layers.domains = domains;
      

      // domains.renderer = {
      //   type: "unique-value",  // autocasts as new UniqueValueRenderer()
      //   field: "Dump_Domain_Domain_KJ",
      //   defaultSymbol: { type: "simple-fill" },
      // };

      // domains.renderer.addUniqueValueInfo({
      //   value: "前橋藩",
      //   symbol: {
      //     type: "simple-fill",
      //     color: "blue"
      //   }
      // });

      // var aikyuuTemplate = {
      //     "title": "Aikyuu: {Dump_Domain_Domain_KJ}",
      // };
    
      // var aikyuu = new FeatureLayer({
      //   url:
      //     "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_aikyuu/MapServer/0",
      //   outfields: ["*"],
      //   title: "Aikyuu",
      //   visible: false,
      //   minScale: 1000000,
      //   opacity: 0.75,
      //   popupTemplate: aikyuuTemplate,
      // });
      // map.layers.add(aikyuu);


      // var bakuryouTemplate = {
      //     "title": "Bakuryou: {Dump_Domain_Domain_KJ}",
      // };
    
      // var bakuryou = new FeatureLayer({
      //   url:
      //     "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_bakuryou/MapServer/0",
      //   outfields: ["*"],
      //   title: "Bakuryou",
      //   visible: false,
      //   minScale: 1000000,
      //   opacity: 0.75,
      //   popupTemplate: bakuryouTemplate,
      // });
      // map.layers.add(bakuryou);


      // var templeLandsTemplate = {
      //     "title": "Temple Lands: {Dump_Domain_Domain_KJ}",
      // };
    
      // var templeLands = new FeatureLayer({
      //   url:
      //     "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_temple_lands/MapServer/0",
      //   outfields: ["*"],
      //   title: "Temple Lands",
      //   visible: false,
      //   minScale: 1000000,
      //   opacity: 0.75,
      //   popupTemplate: templeLandsTemplate,
      // });
      // // map.layers.add(templeLands);

      // var hatamotoTemplate = {
      //     "title": "Hatamoto: {Dump_Domain_Domain_KJ}",
      // };
    
      // var hatamoto = new FeatureLayer({
      //   url:
      //     "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_hatamoto/MapServer/0",
      //   outfields: ["*"],
      //   title: "Hatamoto",
      //   visible: false,
      //   minScale: 1000000,
      //   opacity: 0.75,
      //   popupTemplate: hatamotoTemplate,
      // });
      // // // map.layers.add(hatamoto);
      
      
      // var azukarichiTemplate = {
      //     "title": "Azukarichi: {Dump_Domain_Domain_KJ}",
      // };
    
      // var azukarichi = new FeatureLayer({
      //   url:
      //     "https://www.hgis-indias.net:6443/arcgis/rest/services/DTL/dtl_azukarichi/MapServer/0",
      //   outfields: ["*"],
      //   title: "Azukarichi",
      //   visible: false,
      //   minScale: 1000000,
      //   opacity: 0.75,
      //   popupTemplate: azukarichiTemplate,
      // });
      // map.layers.add(azukarichi);


      // Create a popup template for uncertain belongings
      // let popupUncertainBelongings = {
      //   "title": "Uncertain Belonging",
      //   "content": "<b>Probable 1:</b> {probable_1}<br>\
      //               <b>Possible 1:</b> {possible_1}<br>\
      //               <b>Start Valid:</b> {START_vali}<br>\
      //               <b>End Valid:</b> {END_valid}<br>"
      // }

      // Add uncertain-belonging layer
      // let uncertain_belonging = new FeatureLayer({
      //   url:
      //     "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1?token=3ATb8VJxlM0Q0foAtMo0hpIGD5xuQWrlXNrCpMvc7AaOCVdVe6sG8bV55FBh-d7c5lzD9V9IzSiN6dP7-_F8Drn5cfLXVTsnbP6CRLut0Y1HpPAh-8Huba426E6NDtS7R-54pvPD-aLKRJdW2iayTIyIv4qShZkp1PmP8Ao_gP_SV2Qi3sh8Ef4ueHgD-tjOTruOYTJb3u9IsJCldmqNHOEswwxMPsRYjtqCFi-6HsTPfW-j0vDQIPgEw81TZyza",
      //   outfields: ["*"],
      //   popupTemplate: popupUncertainBelongings,
      // })
      // map.layers.add(uncertain_belonging)

      var domainGroupLayer = new GroupLayer({
        title: "Territorial Ownership",
        visible: true,
        // visibilityMode: "exclusive",
        layers: [domains],
        // layers: [domains],
        opacity: 0.85,
      });
      map.layers.add(domainGroupLayer);

      /* =====================================================================================================
                                  CODE TO FOR CROSS HATCHING TO WORK
      =======================================================================================================*/

      // // Symbol for FUKUI / OONO
      // const FukuiOono = {
      //   type: "picture-fill",
      //   url: "http://localhost:3000/red_yellow.jpg",
      //   width: 500,
      //   height: 500
      // };

      // // Symbol for SABE / FUKUI
      // const SabaeFukui = {
      //   type: "picture-fill",
      //   url: "http://localhost:3000/red_green.jpg",
      //   width: 500,
      //   height: 500
      // };

      // // Symbol for all others
      // const otherSym = {
      //   type: "simple-fill",
      //   // style: "square",
      //   // size: 18,
      //   color: [26, 26, 26, 1]
      // };

      // // Create a renderer to render specific symbols on top of Boundaries layer
      // const boundaryRenderer = {
      //   type: "unique-value", // autocasts as new UniqueValueRenderer()
      //   legendOptions: {
      //     title: "Uncertanties:"
      //   },
      //   defaultSymbol: otherSym,
      //   defaultLabel: "DEFAULT LABEL",
      //   field: "changefr_2",
      //   field2: "changetoDo",
      //   fieldDelimiter: ", ",
      //   uniqueValueInfos: [
      //     {
      //       value: "Fukui, Oono", // code for fukui to oono boundaries
      //       symbol: FukuiOono,
      //       label: "Fukui to Oono"
      //     },
      //     {
      //       value: "Sabae, Fukui", // code for sabae to fukui boundaries
      //       symbol: SabaeFukui,
      //       label: "Sabae to Fukui"
      //     }
      //   ]
      // };

      // Crete a popup template for uncertain boundaries
      // let boundaryChangePopup = {
      //   "title": "Boundary Change",
      //   "content": "<b>Change From 2:</b> {changefr_2}<br>\
      //               <b>Change To Do:</b> {changetoDo}<br>\
      //               <b>Start Valid:</b> {START_vali}<br>\
      //               <b>End Valid:</b> {END_valid}<br>"
      // }

      // // Add boundary-changes layer
      // let boundary_changes = new FeatureLayer({
      //   url:
      //     "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0?token=3ATb8VJxlM0Q0foAtMo0hpIGD5xuQWrlXNrCpMvc7AaOCVdVe6sG8bV55FBh-d7c5lzD9V9IzSiN6dP7-_F8Drn5cfLXVTsnbP6CRLut0Y1HpPAh-8Huba426E6NDtS7R-54pvPD-aLKRJdW2iayTIyIv4qShZkp1PmP8Ao_gP_SV2Qi3sh8Ef4ueHgD-tjOTruOYTJb3u9IsJCldmqNHOEswwxMPsRYjtqCFi-6HsTPfW-j0vDQIPgEw81TZyza",
      //   renderer: boundaryRenderer,
      //   outfields: ["*"],
      //   popupTemplate: boundaryChangePopup,
      // })
      // map.layers.add(boundary_changes)

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

      this.view.whenLayerView(guns).then(function() {
        const fullTimeExtent = guns.timeInfo.fullTimeExtent;

        // set up time slider properties
        timeSlider.fullTimeExtent = fullTimeExtent;
        timeSlider.stops = {
          interval: {
            value: 1,
            unit: "years"
          },
        };
        timeSlider.values =  [new Date(1700, 0, 1)]; // Initialize the current time for the beginning of the fullTimeExtent.
      });

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
                                layer: domains,
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

      // var initPreference = {
      //   domains: {
      //     branch: 'Branch',
      //     uncertainty: 'Newcomer',
      //     styling: 'Domain name'
      //   },
      //   villages: 'Small',
      //   guns: 'Small',
      // }

      // this.updateFilter(initPreference)
      this.isMounted = true;

      setTimeout(() => {
        this.isLoading = false
      },10000)

      // this.view.whenLayerView(villages).then(function() {
      //   this.isLoading = false
      // });

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
  padding-top: 48px;
  margin: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
#mapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
 
#loadScreen{
  z-index: 10000 !;
  width: 100%;
  height: 100%;
  padding-top: 56px;
} 

#timeSlider {
  position: absolute;
  left: 100px;
  right: 100px;
  bottom: 30px;
}
</style>
