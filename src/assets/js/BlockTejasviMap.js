const { makeBindingParser } = require("@angular/compiler");

//console.log("You got me inside BlockTejasMap.js");
var map;
//Initialize State
function IntializeState(StateURL,DistrictURL,BlockURL,PanchayatUrl,mapID,mapdrilldown){

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
   
     //If map already exist 
     if (map) {
        map.destroy();
    }
     //Varialbles declarations
     var stateLayer;

     //For back button functionaity...
     var div = document.getElementById('mapback');
     div.innerHTML = '<b>' + "India" + '</b>';
     
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
      var statesLabel = new TextSymbol().setColor(new Color([0, 0, 0, 1]));
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
        "xmin": 66,
        "ymin": 8,
        "xmax": 102,
        "ymax": 38,
        "spatialReference": { "wkid": 4326 }
    });

     map = new Map(mapID, {
        extent: bounds,
        center: [77.414452, 23.255404],
        zoom: 4,
        slider: true,
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
                    queryTask.execute(query, showResults);
                    //console.log(showResults);
                    
    
    }
    //Show Results
    function showResults(results) {
        console.log("State Data new ->",results);
     //Default Symbol
        var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
        defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
        
            
            var resultItems = [];
            var resultCount = results.features.length;
            for (var i = 0; i < resultCount; i++) {
                var featureAttributes = results.features[i].attributes;
                resultItems.push(featureAttributes);
            }
           
            var renderer = new UniqueValueRenderer(defaultSymbol, "STCODE11");
        
            for (let i = 0; i < resultItems.length; i++) {
                var randomColor =  Color.fromString(getRandomColor());
                
                renderer.addValue(resultItems[i].STCODE11, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,1]), 1.25), randomColor));  
            }  
            stateLayer.setRenderer(renderer);
            map.addLayer(stateLayer);
            
           
    
    }

   
     console.log("Map in State layer is--",map);
     
    
    
      //Events started
      stateLayer.on("mouse-over", function (evt) {
       var stname = esriLang.substitute(evt.graphic.attributes, '${STNAME}');
       map.setMapCursor("pointer");
       map.infoWindow.setContent('<div  >' + '' + stname + '</div>');
       map.infoWindow.resize(140,100);
       map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
      });

      stateLayer.on("mouse-out", function (evt) {
        
        map.setMapCursor("default");
        map.infoWindow.hide();
      });

      stateLayer.on("click", function (evt) {
          console.log("Click working fine.."); 
         
          console.log("Zoom-->",map.getZoom());

      });
      
      
      stateLayer.on("dbl-click", function (evt) {
        var stname = esriLang.substitute(evt.graphic.attributes, '${STNAME}');
        var stcode11 = esriLang.substitute(evt.graphic.attributes, '${STCODE11}');
 
        InitializeDistrict(evt.graphic.attributes,DistrictURL,BlockURL,PanchayatUrl,map,stateLayer);
    });
       
      map.on("layer-add", function (evt){
       // map.setExtent(evt.fullExtent);
         
      });

      map.on("extent-change",function(evt){
        console.log("Extent change seems to be OK..");
        
      });
      
      map.on("load", function () {
          console.log("On map Load..");
          

        // map.disableScrollWheelZoom();
         map.disableDoubleClickZoom();
         //map.disableMapNavigation();
         map.showZoomSlider();
         
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
function InitializeDistrict(attributes,DistrictURL,BlockURL,PanchayatUrl,map,stateLayer)
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

       
     //For back button functionaity...
     var div = document.getElementById('mapback');
     div.innerHTML = '<b>India | ' + attributes.STNAME + '</b>' + ' |  ' + "<a href='javascript:void(0)' onclick='backtoState()'>Back</a>";

        //Declare Variable
        var districtLayer;


        //Declare District Layer
        districtLayer = new FeatureLayer(DistrictURL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            displayField: "dtname",
            showLabels: false
        });


        //Calling function to give random colors to District..
        fillColorDistrict();
      function fillColorDistrict(){

        var queryTask = new esri.tasks.QueryTask(DistrictURL);
    
                    var query = new esri.tasks.Query();
                    query.returnGeometry = false;
                    query.where = "stcode11 = '" + attributes.STCODE11 + "' ";
                    query.outFields = ["*"];
                    queryTask.execute(query, showResults);
                    
    
    }
    //Show Results
    function showResults(results) {
        //Default Symbol
           var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
           defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
           
               
               var resultItems = [];
               var resultCount = results.features.length;
               for (var i = 0; i < resultCount; i++) {
                   var featureAttributes = results.features[i].attributes;
                   resultItems.push(featureAttributes);
               }
              
               var renderer = new UniqueValueRenderer(defaultSymbol, "dtcode11");
           
               for (let i = 0; i < resultItems.length; i++) {
                var randomColor =  Color.fromString(getRandomColor());
                 renderer.addValue(resultItems[i].dtcode11, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,1]), 0.75), randomColor)); 
               }  
               districtLayer.setRenderer(renderer);
               stateLayer.hide();
               map.addLayer(districtLayer);
           
 
       }

         //Events start
         districtLayer.on("mouse-over", function (evt) {

            var dtname = esriLang.substitute(evt.graphic.attributes, '${dtname}');
            map.setMapCursor("pointer");
            map.infoWindow.setContent('<div  >' + '' + dtname + '</div>');
            map.infoWindow.resize(140,100);
            map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
            
          });
    
          districtLayer.on("mouse-out", function (evt) {
            map.setMapCursor("default");
            map.infoWindow.hide();
        
          });
    
          districtLayer.on("click", function (evt) {
             // console.log("Click working fine in District.."); 
          });

          districtLayer.on("dbl-click", function (evt) {
            console.log("Map event:--",evt);
            console.log(" Double Click working fine in Disrtrict..");
            InitializeBlock(BlockURL,evt.graphic.attributes,map,districtLayer,PanchayatUrl);
        });
        //Events end
       
        
       


    });
}

//Initialize Block
function InitializeBlock(BlockURL,attributes,map,districtLayer,PanchayatUrl){
 
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
        //For back button functionaity...
     var div = document.getElementById('mapback');
   
     div.innerHTML = '<b> India | ' + attributes.stname + ' | '+ attributes.dtname+'</b>' + ' |  ' + "<a href='javascript:void(0)' onclick='backtoDistrict()'>Back</a>";
        //Declare Variable
        var blockLayer;
        //Declare Block Layer
        blockLayer = new FeatureLayer(BlockURL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            displayField: "block_name",
            showLabels: false
        });

        fillColorBlock();
        function fillColorBlock(){
          console.log("Inside Fill color");
          var queryTask = new esri.tasks.QueryTask(BlockURL);
      
                      var query = new esri.tasks.Query();
                      query.returnGeometry = false;
                      query.where = "stcode11 = '" + attributes.stcode11 + "' and dtcode11 = '" + attributes.dtcode11 + "'";
                    // query.where = "1=1"; //Getting all data
                     query.outFields = ["*"];
                      
                      queryTask.execute(query, showResults);
                      
                     
      
      }
      function showResults(results) {
        console.log("Block Data new ->",results);
        //Default Symbol
           var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
           defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
           
             
               var resultItems = [];
               var resultCount = results.features.length;
               for (var i = 0; i < resultCount; i++) {
                   var featureAttributes = results.features[i].attributes;
                   resultItems.push(featureAttributes);
               }
              
               var renderer = new UniqueValueRenderer(defaultSymbol, "block_lgd");
           
               for (let i = 0; i < resultItems.length; i++) {
                var randomColor =  Color.fromString(getRandomColor());
                 renderer.addValue(resultItems[i].block_lgd, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,1]), 0.50), randomColor)); 
               }  
              blockLayer.setRenderer(renderer);
               districtLayer.hide();
               map.addLayer(blockLayer);
           
          
       
           
           
       }

        //Events start--------------
        blockLayer.on("mouse-over", function (evt) {

            var dtname = esriLang.substitute(evt.graphic.attributes, '${block_name}');
            map.setMapCursor("pointer");
            map.infoWindow.setContent('<div  >' + '' + dtname + '</div>');
            map.infoWindow.resize(140,100);
            map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
            
          });
    
          blockLayer.on("mouse-out", function (evt) {
            map.setMapCursor("default");
           map.infoWindow.hide();
        
          });
    
          blockLayer.on("click", function (evt) {
             // console.log("Click working fine in Block.."); 
          });

          blockLayer.on("dbl-click", function (evt) {
           console.log("Map event:--",evt);
            console.log(" Double Click working fine in BLock..");
            InitializePanchayat(PanchayatUrl,evt.graphic.attributes,map,blockLayer); 
        });
        //Events end-----------------

  }); 
 }  

 //Initialize panchayat
 function InitializePanchayat(PanchayatUrl,attributes,map,blockLayer){
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
    //For back button functionaity...
    var div = document.getElementById('mapback');
   
    div.innerHTML = '<b> India | ' + attributes.state + ' | '+ attributes.district+' | '+ attributes.block_name+'</b>' + ' |  ' + "<a href='javascript:void(0)' onclick='backtoDistrict()'>Back</a>";
    //Declare Variable
    var panchayatLayer;
    //Declare Panchayat Layer
    panchayatLayer = new FeatureLayer(PanchayatUrl, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        displayField: "gp_name",
        showLabels: false
    });

    fillColorPanchayat();
        function fillColorPanchayat(){
          console.log("Inside Fill color");
          var queryTask = new esri.tasks.QueryTask(PanchayatUrl);
      
                      var query = new esri.tasks.Query();
                      query.returnGeometry = false;
                      query.where = "dtcode11 = '" + attributes.dtcode11 + "' and blk_lgdcod = '" + attributes.block_lgd + "'";
                     //query.where = "1=1"; //Getting all data
                     query.outFields = ["*"];
                      
                      queryTask.execute(query, showResults);
                      
                     
      
      }
      function showResults(results) {
        console.log("Panchayat Data new ->",results);
        //Default Symbol
           var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
           defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
           
             
               var resultItems = [];
               var resultCount = results.features.length;
               for (var i = 0; i < resultCount; i++) {
                   var featureAttributes = results.features[i].attributes;
                   resultItems.push(featureAttributes);
               }
              
               var renderer = new UniqueValueRenderer(defaultSymbol, "gp_code");
           
               for (let i = 0; i < resultItems.length; i++) {
                var randomColor =  Color.fromString(getRandomColor());
                 renderer.addValue(resultItems[i].gp_code, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,1]), 0.50), randomColor)); 
               }  
               panchayatLayer.setRenderer(renderer);
              blockLayer.hide();
            map.addLayer(panchayatLayer);
           
          
       
           
           
       }

       //Events start
       panchayatLayer.on("mouse-over", function (evt) {

        var gp_name = esriLang.substitute(evt.graphic.attributes, '${gp_name}');
        map.setMapCursor("pointer");
        map.infoWindow.setContent('<div  >' + '' + gp_name + '</div>');
        map.infoWindow.resize(140,100);
        map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
        
      });

      panchayatLayer.on("mouse-out", function (evt) {
        map.setMapCursor("default");
        map.infoWindow.hide();
    
      });

      panchayatLayer.on("click", function (evt) {
         // console.log("Click working fine in Panchayat.."); 
      });

      panchayatLayer.on("dbl-click", function (evt) {
        console.log("Map event:--",evt);
        console.log(" Double Click working fine in Panchayat..");
       //last layer
    });
    //Events end

    });
 }
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function backtoState() {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunction();});
}

function backtoDistrict() {
    window.angularComponentReference1.zone.run(() => { window.angularComponentReference1.loadAngularFunction();});
}
