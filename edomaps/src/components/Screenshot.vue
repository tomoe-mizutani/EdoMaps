<template>
  <div id="viewDiv">
    <div id="screenshot" class="hide">
      <button
          id="screenshotBtn"
          class="esri-icon-media"></button>
    </div>
    <div id="screenshotDiv" class="hide">
        <div>
          <img class="js-screenshot-image" />
        </div>
        <!-- <div>
          <label>Set a text to be displayed on the image: </label
          ><input type="text" placeholder="Image text" id="textInput" autofocus />
        </div> -->
        <button
          id="downloadBtn"
          class="action-button"
          aria-label="Download image"
          title="Download image"
        >
          Download image
        </button>
        <button
          id="closeBtn"
          class="action-button"
          aria-label="Back to webscene"
          title="Back to webscene"
        >
          Back to webscene
        </button>
    </div>
    <div id="maskDiv" class="hide screenshotCursor"></div>
  </div>
</template>

<script>
  
  /* =====================================================================================================
                              SCREENSHOT
  =======================================================================================================*/
  // import WebMap from './WebMap.vue'; 

  export default{
    name: 'screenshot',
    props: ['view', 'legend'], 
    // data (){
    //   return {
    //     view: this.$parent.view
    //   }
    // },
    mounted(){
      var self = this;
      // the button that triggers area selection mode
      const screenshotBtn = document.getElementById("screenshotBtn");

      // the orange mask used to select the area
      const maskDiv = document.getElementById("maskDiv");

      // element where we display the print preview
      const screenshotDiv = document.getElementById("screenshotDiv");

      // THIS... this is terrible...
      setTimeout(() => {
        self.view.ui.add(screenshotBtn, "bottom-right");
      }, 5000);

       var coord = {
            xmin: 0,
            ymin: 0,
            xmax: 0,
            ymax: 0
          }
      // add an event listener to trigger the area selection mode
      screenshotBtn.addEventListener("click", function() {
        screenshotBtn.classList.add("active");
        self.view.container.classList.add("screenshotCursor");
        let area = null;

        // listen for drag events and compute the selected area
        const dragHandler = self.view.on("drag", function(event) {
          var point = self.view.toMap(event.origin)
          coord.xmin = point.x
          coord.ymin = point.y
          // prevent navigation in the self.view
          event.stopPropagation();
       
          // when the user starts dragging or is dragging
          if (event.action !== "end") {
            // calculate the extent of the area selected by dragging the cursor
            const xmin = clamp(
              Math.min(event.origin.x, event.x), 0, self.view.width);
            const xmax = clamp(
              Math.max(event.origin.x, event.x), 0, self.view.width);
            const ymin = clamp(
              Math.min(event.origin.y, event.y), 0, self.view.height);
            const ymax = clamp(
              Math.max(event.origin.y, event.y), 0, self.view.height);
            area = {
              x: xmin,
              y: ymin,
              width: xmax - xmin,
              height: ymax - ymin
            };
            // set the position of the div element that marks the selected area
            setMaskPosition(area);
          }
          // when the user stops dragging
          else {
            var rpoint = self.view.toMap(event)
            coord.xmax = rpoint.x
            coord.ymax = rpoint.y
            
            // remove the drag event listener from the SceneView
            dragHandler.remove();
            // the screenshot of the selected area is taken
            self.view
              .takeScreenshot({ area: area, format: "jpg", quality: 100})
              .then(function(screenshot) {
                // display a preview of the image
                showPreview(screenshot);
              })
               // create the image for download
                document.getElementById("downloadBtn").onclick = async function() {
                  // const text = document.getElementById("textInput").value;
                  // const dataUrl = addLegendToImage(screenshot);
                  var dataUrl = await queryImage()
                  window.open(dataUrl);
                  // downloadImage("untitled.png", dataUrl)
                }
                // the screenshot mode is disabled
                screenshotBtn.classList.remove("active");
                self.view.container.classList.remove("screenshotCursor");
                setMaskPosition(null);
          }
        });

        function setMaskPosition(area) {
          if (area) {
            maskDiv.classList.remove("hide");
            maskDiv.style.left = area.x + "px";
            maskDiv.style.top = area.y + 50 + "px";
            maskDiv.style.width = area.width + "px";
            maskDiv.style.height = area.height + "px";
          } else {
            maskDiv.classList.add("hide");
          }
        }
        
        function clamp(value, from, to) {
          return value < from ? from : value > to ? to : value;
        }
      });

      // creates an image that will be appended to the DOM
      // so that users can have a preview of what they will download
      function showPreview(screenshot) {
        screenshotDiv.classList.remove("hide");
        // add the screenshot dataUrl as the src of an image element
        const screenshotImage = document.getElementsByClassName(
          "js-screenshot-image"
        )[0];
        screenshotImage.width = screenshot.data.width;
        screenshotImage.height = screenshot.data.height;
        screenshotImage.src = screenshot.dataUrl;
      }

      async function queryImage(){
        // data.append('Web_Map_as_JSON', JSON.stringify({"operationalLayers":[{"type":"VectorTileLayer","styleUrl":"https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json","id":"gray-base-layer","title":"World Light Gray","opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/3","id":"1706e5bdfb5-layer-5","title":"Files v4 - Gun","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/4","id":"1706e5bdfb5-layer-6","opacity":0.8,"title":"Files v4 - Villages to domains","showLabels":true,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1","id":"1706e5bdfb5-layer-8","title":"Overlays - Uncertainbelonging","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0","id":"1706e5bdfb5-layer-9","title":"Overlays - Boundarychanges","layerDefinition":{"drawingInfo":{"renderer":{"type":"uniqueValue","field1":"changefr_2","field2":"changetoDo","legendOptions":{"title":"Uncertanties:"},"defaultLabel":"DEFAULT LABEL","defaultSymbol":{"type":"esriSFS","color":[26,26,26,255],"outline":{"type":"esriSLS","color":[0,0,0,255],"width":0.75,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"fieldDelimiter":", ","uniqueValueInfos":[{"label":"Fukui to Oono","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_yellow.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Fukui, Oono"},{"label":"Sabae to Fukui","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_green.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Sabae, Fukui"}]}}},"showLabels":true,"opacity":1,"minScale":0,"maxScale":0}],"mapOptions":{"extent":{"spatialReference":{"latestWkid":3857,"wkid":102100},"xmin":14975258.010328524,"ymin":4223777.491982939,"xmax":15205181.051256388,"ymax":4429546.383664394},"spatialReference":{"latestWkid":3857,"wkid":102100},"showAttribution":true,"scale":1155583.4197442674,"time": [-8488800000000]},"exportOptions":{"dpi":96},"layoutOptions":{"titleText":"My Print","authorText":"Sam","copyrightText":"My Company","scaleBarOptions":{},"legendOptions":{"operationalLayers":[{"id":"1706e5bdfb5-layer-5"},{"id":"1706e5bdfb5-layer-6"},{"id":"1706e5bdfb5-layer-8"},{"id":"1706e5bdfb5-layer-9"}]}}}))
        console.log(coord)
        var operationalLayer = [
          {
            "type": "VectorTileLayer",
            "styleUrl": "https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json",
            "id": "gray-base-layer",
            "title": "World Light Gray",
            "opacity": 1,
            "minScale": 0,
            "maxScale": 0
          },
          {
            "url": "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/3",
            "id": "1706e5bdfb5-layer-5",
            "title": "Files v4 - Gun",
            "showLabels": true,
            "opacity": 1,
            "minScale": 0,
            "maxScale": 0
          },
          {
            "url": "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/4",
            "id": "1706e5bdfb5-layer-6",
            "opacity": 0.8,
            "title": "Files v4 - Villages to domains",
            "showLabels": true,
            "minScale": 0,
            "maxScale": 0
          },
          {
            "url": "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1",
            "id": "1706e5bdfb5-layer-8",
            "title": "Overlays - Uncertainbelonging",
            "showLabels": true,
            "opacity": 1,
            "minScale": 0,
            "maxScale": 0
          },
          {
            "url": "https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0",
            "id": "1706e5bdfb5-layer-9",
            "title": "Overlays - Boundarychanges",
            "layerDefinition": {
              "drawingInfo": {
                "renderer": {
                  "type": "uniqueValue",
                  "field1": "changefr_2",
                  "field2": "changetoDo",
                  "legendOptions": {
                    "title": "Uncertanties:"
                  },
                  "defaultLabel": "DEFAULT LABEL",
                  "defaultSymbol": {
                    "type": "esriSFS",
                    "color": [26, 26, 26, 255],
                    "outline": {
                      "type": "esriSLS",
                      "color": [0, 0, 0,255],
                      "width": 0.75,
                      "style": "esriSLSSolid"
                    },
                    "style": "esriSFSSolid"
                  },
                  "fieldDelimiter": ", ",
                  "uniqueValueInfos": [
                    {
                      "label": "Fukui to Oono",
                      "symbol": {
                        "type": "esriPFS",
                        "color": [0, 0, 0, 255],
                        "url": "http://localhost:3000/red_yellow.jpg",
                        "xscale": 1,
                        "yscale": 1,
                        "width": 500,
                        "height": 500,
                        "xoffset": 0,
                        "yoffset": 0
                      },
                      "value": "Fukui, Oono"
                    },
                    {
                      "label": "Sabae to Fukui",
                      "symbol": {
                        "type": "esriPFS",
                        "color": [0, 0, 0, 255],
                        "url": "http://localhost:3000/red_green.jpg",
                        "xscale": 1,
                        "yscale": 1,
                        "width": 500,
                        "height": 500,
                        "xoffset": 0,
                        "yoffset": 0
                      },
                      "value": "Sabae, Fukui"
                    }
                  ]
                }
              }
            },
            "showLabels": true,
            "opacity": 1,
            "minScale": 0,
            "maxScale": 0
          }
        ]

        var mapOptions = {
          "extent": {
            // "spatialReference": {"latestWkid": 3857, "wkid": 102100},
            "xmin": coord.xmin,
            "ymin": coord.ymax,
            "xmax": coord.xmax,
            "ymax": coord.ymin,
          },
          // "spatialReference": {
          //   "latestWkid": 3857,
          //   "wkid": 102100
          // },
          "showAttribution": true,
          // "scale": self.view.scale - 500000,
          "time": [-8488800000000, -8457264000000], //TODO: retrieve 
        } 

        var exportOptions = {"dpi": 96}

        var layoutOptions = {
          "authorText": "",
          "copyrightText": "",
          "customTextElements" : [
            {"Date" : "date goes here"},
          ],
          "scaleBarOptions": {},
          "legendOptions": {
            "operationalLayers": [
              {
                "id": "1706e5bdfb5-layer-5"
              },
              {
                "id": "1706e5bdfb5-layer-6"
              },
              {
                "id": "1706e5bdfb5-layer-8"
              },
              {
                "id": "1706e5bdfb5-layer-9"
              }
            ]
          }
        }
        var webMapAsJSon = JSON.stringify({
          "operationalLayers": operationalLayer,
          "mapOptions": mapOptions,
          "exportOptions": exportOptions,
          "layoutOptions": layoutOptions
        })
      
        var data = new URLSearchParams(); 
        data.append('Web_Map_as_JSON', webMapAsJSon)
        data.append('Format', 'PDF') //TODO: support png download
        data.append('Layout_Template', 'Letter ANSI A Landscape')
        data.append('returnFeatureCollection', 'false')
        data.append('returnM', 'false')
        data.append('returnZ', 'false')
        data.append('f', 'json')

        var url = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute"
        // formData = JSON.stringify({"Web_Map_as_JSON":{"operationalLayers":[{"type":"VectorTileLayer","styleUrl":"https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json","id":"gray-base-layer","title":"World Light Gray","opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/3","id":"1706e5bdfb5-layer-5","title":"Files v4 - Gun","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/Files_v4/FeatureServer/4","id":"1706e5bdfb5-layer-6","opacity":0.8,"title":"Files v4 - Villages to domains","showLabels":true,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/1","id":"1706e5bdfb5-layer-8","title":"Overlays - Uncertainbelonging","showLabels":true,"opacity":1,"minScale":0,"maxScale":0},{"url":"https://services1.arcgis.com/7uJv7I3kgh2y7Pe0/arcgis/rest/services/overlays/FeatureServer/0","id":"1706e5bdfb5-layer-9","title":"Overlays - Boundarychanges","layerDefinition":{"drawingInfo":{"renderer":{"type":"uniqueValue","field1":"changefr_2","field2":"changetoDo","legendOptions":{"title":"Uncertanties:"},"defaultLabel":"DEFAULT LABEL","defaultSymbol":{"type":"esriSFS","color":[26,26,26,255],"outline":{"type":"esriSLS","color":[0,0,0,255],"width":0.75,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"fieldDelimiter":", ","uniqueValueInfos":[{"label":"Fukui to Oono","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_yellow.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Fukui, Oono"},{"label":"Sabae to Fukui","symbol":{"type":"esriPFS","color":[0,0,0,255],"url":"http://localhost:3000/red_green.jpg","xscale":1,"yscale":1,"width":500,"height":500,"xoffset":0,"yoffset":0},"value":"Sabae, Fukui"}]}}},"showLabels":true,"opacity":1,"minScale":0,"maxScale":0}],"mapOptions":{"extent":{"spatialReference":{"latestWkid":3857,"wkid":102100},"xmin":14975258.010328524,"ymin":4223777.491982939,"xmax":15205181.051256388,"ymax":4429546.383664394},"spatialReference":{"latestWkid":3857,"wkid":102100},"showAttribution":true,"scale":1155583.4197442674},"exportOptions":{"dpi":96},"layoutOptions":{"titleText":"My Print","authorText":"Sam","copyrightText":"My Company","scaleBarOptions":{},"legendOptions":{"operationalLayers":[{"id":"1706e5bdfb5-layer-5"},{"id":"1706e5bdfb5-layer-6"},{"id":"1706e5bdfb5-layer-8"},{"id":"1706e5bdfb5-layer-9"}]}}}})
        
        var response = await fetch(url, {
          method: 'POST',
          body: data,
        })
        var myJson = await response.json();
        console.log(self.view.scale)
        console.log(myJson);
        console.log(myJson.results[0].value.url);
        return myJson.results[0].value.url
      }

      // function downloadImage(filename, dataUrl) {
      //   // the download is handled differently in Microsoft browsers
      //   // because the download attribute for <a> elements is not supported
      //   if (!window.navigator.msSaveOrOpenBlob) {
      //     // in browsers that support the download attribute
      //     // a link is created and a programmatic click will trigger the download
      //     const element = document.createElement("a");
      //     // console.log("dataurl:")
      //     // console.log(dataUrl)

      //     element.setAttribute("href", dataUrl);
      //     element.setAttribute("download", filename);
      //     // element.style.display = "none";
      //     document.body.appendChild(element);
      //     element.click();
      //     document.body.removeChild(element);
      //   } 
      // }

      // button to hide the print preview html element
      document
        .getElementById("closeBtn")
        .addEventListener("click", function() {
          screenshotDiv.classList.add("hide");
        });
    }
  }
</script>
<style>
  #screenshot {
    padding: 0;
    height: 20%;
    width: 20%;
    /* position: absolute; */
    /* right: 100px;
    top: 0px; */
    z-index: 2;
  }

  .esri-icon-media{
    padding: 8px 8px;
    color: #656565;
    border: none;
    transition-duration: 0.2s;
  }
  .esri-icon-media:hover {
    background-color: #EDEDED; /* Green */
    color: black;
  }

  /* #viewDiv {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  } */

  #screenshotDiv {
    position: absolute;
    padding-top: 80px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    /* z-index: 2; */
  }

  .hide {
    display: none;
  }

  img {
    border: 10px solid white;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
  }

  #screenshotDiv > * {
    margin: 0.5em;
    z-index: 2;
  } 

  .screenshotCursor {
    cursor: crosshair;
  }

  .action-button {
    padding: 0.6em;
    border: 1px solid #0079c1;
    text-align: center;
    background-color: white;
    cursor: pointer;
  }

  .action-button:hover,
  .action-button:focus {
    background: #0079c1;
    color: white;
  }

  #maskDiv {
    position: absolute;
    background: rgba(255, 51, 0, 0.1);
    border: 2px dashed rgb(255, 51, 0);
    /* z-index: 2; */
  }
</style>
