console.log("You got me inside BlockTejasMap.js");

//Initialize State
function IntializeState(StateURL,DistrictURL,BlockURL,mapID){

    require([
        "dojo/dom-construct", "esri/dijit/BasemapGallery", "esri/dijit/BasemapToggle",
        "esri/map", "esri/geometry/webMercatorUtils",
        "esri/layers/FeatureLayer",
        "esri/dijit/Legend", "esri/dijit/Search", "esri/renderers/ScaleDependentRenderer",
        "esri/symbols/Font", "esri/geometry/Point",
        "esri/SpatialReference", "esri/graphic", "esri/lang",
        "esri/dijit/PopupTemplate",
        "esri/renderers/UniqueValueRenderer", "esri/symbols/TextSymbol",
        "dijit/registry", "dijit/form/Button", "dijit/TooltipDialog",
        "dijit/popup", "esri/arcgis/utils",
        "esri/geometry/Extent",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
        "esri/Color", "dojo/number", "dojo/dom-style", "esri/dijit/FeatureTable",
        "esri/layers/LabelClass",
        "dojo/domReady!"
    ], function (
        domConstruct, BasemapGallery, BasemapToggle,
        Map, webMercatorUtils, FeatureLayer, Legend,
        Search, ScaleDependentRenderer, Font, Point, SpatialReference,
        Graphic, esriLang, PopupTemplate,
        UniqueValueRenderer, TextSymbol, registry,
        Button, TooltipDialog, dijitPopup,
        arcgisUtils,
        Extent,
        InfoTemplate, SimpleMarkerSymbol, PictureMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol,
        SimpleRenderer, Color, number, domStyle, FeatureTable, LabelClass
    ) {
//Main logic here
     
     //Varialbles declarations
     var stateLayer;
     
     // create a renderer for the states layer to override default symbology
     var statesColor = new Color("#000000");
     var statesLine = new SimpleLineSymbol("solid", statesColor, 1.5);
     var statesSymbol = new SimpleFillSymbol("solid", statesLine, null);
     var statesRenderer = new SimpleRenderer(statesSymbol);

     stateLayer = new FeatureLayer(StateURL, {
     mode: FeatureLayer.MODE_ONDEMAND,
     outFields: ["*"],
     //outFields: ["*"],
     displayField: "STNAME",
     showLabels: true
     });

     stateLayer.setRenderer(statesRenderer);

      // create a text symbol to define the style of labels
      var statesLabel = new TextSymbol().setColor(new Color([230, 0, 169, 1]));
      statesLabel.font.setSize("8pt");
      statesLabel.font.setFamily("arial");

      //this is the very least of what should be set within the JSON  
      var json = {
        "labelExpressionInfo": {"value": "{STNAME}"}
      };

       //create instance of LabelClass (note: multiple LabelClasses can be passed in as an array)
       var labelClass = new LabelClass(json);
       labelClass.symbol = statesLabel; // symbol also can be set in LabelClass' json
       stateLayer.setLabelingInfo([ labelClass ]);
      
     var bounds = new Extent({
        "xmin": 53.382852,
        "ymin": 11.575403999999999,
        "xmax": 101.446052,
        "ymax": 34.935404,
        "spatialReference": { "wkid": 4326 }
    });

    var map = new Map(mapID, {
        extent: bounds,
        center: [77.414452, 23.255404],
        zoom: 4,
        slider: false,
        showLabels: true,
        logo: false,
        basemap: "none", //satellite,hybrid,streets
    });

    fillColorState();
    function fillColorState(){

        var queryTask = new esri.tasks.QueryTask(StateURL);
    
                    var query = new esri.tasks.Query();
                    query.returnGeometry = false;
                    query.where = "1=1";
                    query.outFields = ["*"];
                    // query.text = "California";
                    queryTask.execute(query, showResults);
                    //console.log(showResults);
    
    }
    //Show Results
    function showResults(results) {
     //Default Symbol
        var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
        defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
        
            console.log("State Data new ->",results);
            var resultItems = [];
            var resultCount = results.features.length;
            for (var i = 0; i < resultCount; i++) {
                var featureAttributes = results.features[i].attributes;
                resultItems.push(featureAttributes);
            }
           
            var renderer = new UniqueValueRenderer(defaultSymbol, "State_LGD");
        
            for (let i = 0; i < resultItems.length; i++) {
                if(resultItems[i].State_LGD>0)  
                renderer.addValue(resultItems[i].State_LGD, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 1]), 1.25), new Color([255, 0, 0, 0.31])));
               else
               renderer.addValue(resultItems[i].State_LGD, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 1]), 1.25), new Color([0, 0, 0, 0])));

            }  
            stateLayer.setRenderer(renderer);
            map.addLayer(stateLayer);
        
       
    
        
        // runLog();
    }

   
     console.log("Map is--",map);
     
    
    
      //Events
      stateLayer.on("mouse-over", function (evt) {
    //console.log("Mouse-over working fine..");
      });

      stateLayer.on("mouse-out", function (evt) {
        //console.log("Mouse-out working fine..");
    
      });

      stateLayer.on("click", function (evt) {
          console.log("Click working fine.."); 
      });
      
      
      stateLayer.on("dbl-click", function (evt) {
        var stname = esriLang.substitute(evt.graphic.attributes, '${STNAME}');
        var stcode11 = esriLang.substitute(evt.graphic.attributes, '${State_LGD}');

        console.log(" Double Click working fine..",stname,"<---->",stcode11);
        
        InitializeDistrict(stname,stcode11,DistrictURL,map,stateLayer);
    });
       
      map.on("layer-add", function (evt){
       // map.setExtent(evt.fullExtent);
          console.log("layer-add seems to be working..");
          console.log(evt);
      });
      map.on("extent-change",function(evt){
console.log("Extent change seems to be OK..");
console.log(evt);
      });
      
      map.on("load", function () {
          console.log("On map Load..");
          

        // map.disableScrollWheelZoom();
         map.disableDoubleClickZoom();
         //map.disableMapNavigation();
         
         
         // map.disableRubberBandZoom();
         // map.disablePan();
         // map.disableKeyboardNavigation();
         map.disableShiftDoubleClickZoom();
         map.graphics.enableMouseEvents();
         // map.graphics.on("mouse-out", closeDialog);

     });
     //Events Ended
     

    }
    );
}

//Initialize District
function InitializeDistrict(StateName, StateCode,DistrictURL,map,stateLayer)
{
    require([
        "dojo/dom-construct", "esri/dijit/BasemapGallery", "esri/dijit/BasemapToggle",
        "esri/map", "esri/geometry/webMercatorUtils",
        "esri/layers/FeatureLayer",
        "esri/dijit/Legend", "esri/dijit/Search", "esri/renderers/ScaleDependentRenderer",
        "esri/symbols/Font", "esri/geometry/Point",
        "esri/SpatialReference", "esri/graphic", "esri/lang",
        "esri/dijit/PopupTemplate",
        "esri/renderers/UniqueValueRenderer", "esri/symbols/TextSymbol",
        "dijit/registry", "dijit/form/Button", "dijit/TooltipDialog",
        "dijit/popup", "esri/arcgis/utils",
        "esri/geometry/Extent",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
        "esri/Color", "dojo/number", "dojo/dom-style", "esri/dijit/FeatureTable",
        "dojo/domReady!"
    ], function (
        domConstruct, BasemapGallery, BasemapToggle,
        Map, webMercatorUtils, FeatureLayer, Legend,
        Search, ScaleDependentRenderer, Font, Point, SpatialReference,
        Graphic, esriLang, PopupTemplate,
        UniqueValueRenderer, TextSymbol, registry,
        Button, TooltipDialog, dijitPopup,
        arcgisUtils,
        Extent,
        InfoTemplate, SimpleMarkerSymbol, PictureMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol,
        SimpleRenderer, Color, number, domStyle, FeatureTable
    ) {
        //Declare Variable
        var districtLayer;

        //Declare District Layer
        districtLayer = new FeatureLayer(DistrictURL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            //outFields: ["*"],
            displayField: "dtname",
            showLabels: false
        });

        //Adding District Layer to Map..
  


        fillColorDistrict();
      function fillColorDistrict(){

        var queryTask = new esri.tasks.QueryTask(DistrictURL);
    
                    var query = new esri.tasks.Query();
                    query.returnGeometry = false;
                    query.where = "1=1";
                    query.where = "State_LGD = " + StateCode;
                    query.outFields = ["*"];
                    // query.text = "California";
                    queryTask.execute(query, showResults);
                    //console.log(showResults);
    
    }
    //Show Results
    function showResults(results) {
        //Default Symbol
           var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
           defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
           
               console.log("District Data new ->",results);
               var resultItems = [];
               var resultCount = results.features.length;
               for (var i = 0; i < resultCount; i++) {
                   var featureAttributes = results.features[i].attributes;
                   resultItems.push(featureAttributes);
               }
              
               var renderer = new UniqueValueRenderer(defaultSymbol, "Dist_LGD");
           
               for (let i = 0; i < resultItems.length; i++) {
                 renderer.addValue(resultItems[i].Dist_LGD, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 38, 115, 1]), 1.25), new Color([255, 0, 197, 0.6]))); 
               }  
               districtLayer.setRenderer(renderer);
               stateLayer.hide();
               map.addLayer(districtLayer);
           
          
       
           
           // runLog();
       }

         //Events start
         districtLayer.on("mouse-over", function (evt) {
          // console.log("Mouse-over working fine in District..");
          });
    
          districtLayer.on("mouse-out", function (evt) {
           // console.log("Mouse-out working fine in District..");
        
          });
    
          districtLayer.on("click", function (evt) {
             // console.log("Click working fine in District.."); 
          });

          districtLayer.on("dbl-click", function (evt) {
           console.log("Map event:--",evt);
            console.log(" Double Click working fine in Disrtrict..");
            
        });
        //Events end
       
        
       


    });
}

 function InitializeBlock(BlockName,BlockCode,map){
 
    require([
        "dojo/dom-construct", "esri/dijit/BasemapGallery", "esri/dijit/BasemapToggle",
        "esri/map", "esri/geometry/webMercatorUtils",
        "esri/layers/FeatureLayer",
        "esri/dijit/Legend", "esri/dijit/Search", "esri/renderers/ScaleDependentRenderer",
        "esri/symbols/Font", "esri/geometry/Point",
        "esri/SpatialReference", "esri/graphic", "esri/lang",
        "esri/dijit/PopupTemplate",
        "esri/renderers/UniqueValueRenderer", "esri/symbols/TextSymbol",
        "dijit/registry", "dijit/form/Button", "dijit/TooltipDialog",
        "dijit/popup", "esri/arcgis/utils",
        "esri/geometry/Extent",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
        "esri/Color", "dojo/number", "dojo/dom-style", "esri/dijit/FeatureTable",
        "dojo/domReady!"
    ], function (
        domConstruct, BasemapGallery, BasemapToggle,
        Map, webMercatorUtils, FeatureLayer, Legend,
        Search, ScaleDependentRenderer, Font, Point, SpatialReference,
        Graphic, esriLang, PopupTemplate,
        UniqueValueRenderer, TextSymbol, registry,
        Button, TooltipDialog, dijitPopup,
        arcgisUtils,
        Extent,
        InfoTemplate, SimpleMarkerSymbol, PictureMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol,
        SimpleRenderer, Color, number, domStyle, FeatureTable
    ) {
        //Declare Variable
        var blockLayer;
        //Declare District Layer
        blockLayer = new FeatureLayer(DistrictURL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            //outFields: ["*"],
            displayField: "dtname",
            showLabels: false
        });

  }); 
 }  
