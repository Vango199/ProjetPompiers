map = L.map('mapid').setView([45.75, 4.85], 11);
let TempsdeRefresh = 5000;

mapIdFireLayerOld = new Map();

var A = L.layerGroup();
var B_Gasoline = L.layerGroup();
var B_Alcohol = L.layerGroup();
var B_Plastics = L.layerGroup();
var C_Flammable_Gases = L.layerGroup();
var D_Metals = L.layerGroup();
var E_Electric = L.layerGroup();

var start_fire = L.layerGroup();
var medium_fire = L.layerGroup();
var big_fire = L.layerGroup();
var fire_emergency = L.layerGroup();



var itineraire = L.layerGroup();

var pompier = L.layerGroup();

var FiretruckIcon = new L.Icon({
    iconUrl: '../Img/my-icon.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });
  var CarIcon = new L.Icon({
    iconUrl: '../Img/my-icon.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });
  var PumperTruckIcon = new L.Icon({
    iconUrl: '../Img/my-icon.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });
  var WaterTenderIcon = new L.Icon({
    iconUrl: '../Img/my-icon.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });
  var LadderTruckIcon = new L.Icon({
    iconUrl: '../Img/my-icon.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });    
  var TruckIcon = new L.Icon({
    iconUrl: '../Img/my-icon.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });

////////////////////////////////////////////////////// AFFICHAGE DE LA MAP /////////////////////////////////////////////////


function init() {



// this is where the code for the next step will go

    const mainLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoidG90by1ldC1nYWJvdSIsImEiOiJja3BlMTJwMHIwM2RvMndvNjVjNWcyeTdkIn0.8DWPSvTRKHCwUmXACaZP0w'
    });

    const darkmode = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 16,
      id: 'mapbox/dark-v10',
      accessToken: 'pk.eyJ1IjoidG90by1ldC1nYWJvdSIsImEiOiJja3BlMTJwMHIwM2RvMndvNjVjNWcyeTdkIn0.8DWPSvTRKHCwUmXACaZP0w'
  });
    

    darkmode.addTo(map);

    itineraire.addTo(map);
    
 
    start_fire.addTo(map);
    medium_fire.addTo(map);
    big_fire.addTo(map);
    fire_emergency.addTo(map);

    A.addTo(map);
    B_Gasoline.addTo(map);
    B_Alcohol.addTo(map);
    B_Plastics.addTo(map);
    C_Flammable_Gases.addTo(map);
    D_Metals.addTo(map);
    E_Electric.addTo(map);



    var overlayMaps_mode = {
      "Light mode" : mainLayer,
      "Dark mode" : darkmode
    }

    var overlayMaps_itineraire = {
      "Itinéraires" : itineraire
    }

    var overlayMaps_fire = {
        "Start fire": start_fire,
        "Medium Fire": medium_fire,
        "Big Fire": big_fire,
        "Fire Emergency": fire_emergency
    
    };

    var overlayMaps_type = {
        "A": A,
        "B_Gasoline": B_Gasoline,
        "B_Alcohol": B_Alcohol,
        "B_Plastics": B_Plastics,
        "C_Flammable_Gases": C_Flammable_Gases,
        "D_Metals": D_Metals,
        "E_Electric": E_Electric,
    }
    
    

    L.control.layers(overlayMaps_mode, overlayMaps_itineraire).addTo(map);
    L.control.layers(null,overlayMaps_fire).addTo(map);
    L.control.layers(null,overlayMaps_type).addTo(map);

  GetAllFire();
  //GetAllCamionsBomberos();
}

