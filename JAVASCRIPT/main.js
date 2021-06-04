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
  GetAllCamionsBomberos();
}


////////////////////////////////////////////////////// AFFICHAGE DES FEUX /////////////////////////////////////////////////


function GetAllFire(){ //appel de la liste avec tous les feux
    fetch('http://localhost:8081/fire')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        // Examine the text in the response
        response.json().then(function(data) {
            displayFire(data);
       //   AffichageFeux(data);
          return data;
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
    setTimeout(GetAllFire, TempsdeRefresh);
}




function getColor(i) {//get a color in function of the intensity of the fire
    return perc2color(i);
}

function getColorDark(i) {//get a color in function of the intensity of the fire
    return perc2colorDark(i);
}

function displayFire(body){

    mapIdFireLayerNew = new Map(); 
        
    for(const fire of body){

        if (!mapIdFireLayerOld.has(fire.id)){//if the fire doesn't have a marker
            var circle = L.circle([fire.lat, fire.lon], {//creation of a marker
                color: getColorDark(fire.intensity),
                fillColor: getColor(fire.intensity),
                fillOpacity: 1.0,
                radius: 3*fire.range
            })

            switch (fire.type){//add the marker to a layer group to be able to filter the fire with his type
                case 'A':
                    type = A;
                    circle.addTo(A);
                    break;
                case 'B_Gasoline':
                    type = B_Gasoline;
                    circle.addTo(B_Gasoline);
                    break;
                case 'B_Alcohol':
                    type = B_Alcohol;
                    circle.addTo(B_Alcohol);
                    break;
                case 'B_Plastics':
                    type = B_Plastics;
                    circle.addTo(B_Plastics);
                    break;
                case 'C_Flammable_Gases':
                    type = C_Flammable_Gases;
                    circle.addTo(C_Flammable_Gases);
                    break;
                case 'D_Metals':
                    type = D_Metals;
                    circle.addTo(D_Metals);
                    break;
                case 'E_Electric':
                    type = E_Electric;
                    circle.addTo(E_Electric);
                    break;
                default:
                    break;
            }


            circle.bindPopup("<img alt='fire image' src=../Img/feu.png height=30 width=25 lenght=30 ><br>Fire " + fire.type + "<br>Intensity: " + Math.round(fire.intensity * 100) / 100 + "<br>Range: " + fire.range);
            //add popup to the marker to display the information about the fire

            if (fire.intensity > 49){//add the fire to a layer group based on his intensity
                group = fire_emergency;
                circle.addTo(fire_emergency);
            }
            else if (fire.intensity > 35){
                group = big_fire;
                circle.addTo(big_fire);
            }
            else if (fire.intensity > 15){
                group = medium_fire;
                circle.addTo(medium_fire);
            }
            else{
                group = start_fire;
                circle.addTo(start_fire);
            }
            mapIdFireLayerNew.set(fire.id,[circle,group,type])//add the fire to a map (=dico in python), key = id fire, value = [marker,layergroupIntensity,layergroupType]
        }
        else {//if the fire has a marker
            mapIdFireLayerOld.get(fire.id)[0].getPopup().setContent("<img src=../Img/feu.png height=30 lenght=30 width=25><br>Fire " + fire.type + "<br>Intensity: " + Math.round(fire.intensity * 100) / 100 + "<br>Range: " + fire.range);
            //we update his information in the popup

            if (fire.intensity > 49){
                group = fire_emergency;
            }
            else if (fire.intensity > 35){
                group = big_fire;
            }
            else if (fire.intensity > 15){
                group = medium_fire;
            }
            else{
                group = start_fire;
            }

            if (group._leaflet_id != mapIdFireLayerOld.get(fire.id)[1]._leaflet_id){//if he is in a different intensity category
                mapIdFireLayerOld.get(fire.id)[1].removeLayer(mapIdFireLayerOld.get(fire.id)[0]);//we remove the marker from his old layergroup
                mapIdFireLayerOld.get(fire.id)[0].addTo(group);//we add the marker to his new layergroup
                mapIdFireLayerOld.get(fire.id)[0].setStyle({//we change the color of the marker
                    color: getColorDark(fire.intensity),
                    fillColor: getColor(fire.intensity)
                })
            }
            mapIdFireLayerNew.set(fire.id,[mapIdFireLayerOld.get(fire.id)[0],group,mapIdFireLayerOld.get(fire.id)[2]]);//add the fire to the new map
            mapIdFireLayerOld.delete(fire.id);//delete the fire from the old map
        }
    }

    if (mapIdFireLayerOld.size != 0){//if there is still fires in the old map, it means that there is fire that doesn't exist anymore
        mapIdFireLayerOld.forEach(function(value, key) {//so for every fire that died
            value[1].removeLayer(value[0]);//we remove the marker from the layer groups
            value[2].removeLayer(value[0]);
            map.removeLayer(value[0]);//we remove the marker from the map
            mapIdFireLayerOld.delete(key);//we delete the fire from the old map
          });
    }

    mapIdFireLayerOld = new Map(mapIdFireLayerNew);//we copy the new map into the old one
}








function perc2color(perc) { //Création d'une échelle de couleurs en fonction de l'intensité du feu pour l'interieur du cercle
	var r, g, b = 0;
	//if(perc < 50) {
		r = 253;
		g = 255-(Math.round(5.1 * perc));
	//}
	//else {
	//	r = 200;
	//	g = Math.round(510 - 5.10 * perc);
	//}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}


function perc2colorDark(perc) { //Création d'une échelle de couleurs en fonction de l'intensité du feu pour le contour du cercle
	var r, g, b = 0;
	//if(perc < 50) {
		r = 255;
		g = (255-(Math.round(5.1 * perc)));
	//}
	//else {
	//	r = 200;
	//	g = Math.round(510 - 5.10 * perc);
	//}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}



////////////////////////////////////////////////////// AFFICHAGE DES CAMIONS DE BOMBEROS /////////////////////////////////////////////////

function GetAllCamionsBomberos(){ //appel de la liste avec tous les camions de pompier
  fetch('http://localhost:8081/vehicle')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        AffichageCamions(data);
        return data;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  setTimeout(GetAllCamionsBomberos, TempsdeRefresh);
}

function AffichageCamions(AllCamionsBomberosList){



for (i in AllCamionsBomberosList){//On parcourt la liste des feux pour venir les afficher sur la map

var myIcon = L.icon({
  iconUrl: '../Img/my-icon.png',
  iconSize: [30,  20],
  iconAnchor: [29, 19],
});

var my_marker =L.marker([AllCamionsBomberosList[i].lat, AllCamionsBomberosList[i].lon], {icon: myIcon});
my_marker.bindPopup(AffichageDonneeCamionsBomberos(AllCamionsBomberosList[i]));
my_marker.addTo(pompier);
pompier.addTo(map);
}
}

function AffichageDonneeCamionsBomberos(Camion){ //Affichage des données liées au feu
  y = '<p>' + '<img src="../Img/my-icon.png" width="25" height="25" />' + '<b>  Camion de Pompier : </b>'+ '<br />' + 'Id : ' + Camion.id+ '<br />' + 'Type : ' + Camion.type+ '<br />' + 'Capacité : ' + Camion.crewMemberCapacity + '<br />' + 'Fuel : : ' + Camion.fuel;
  return y.toString()
}

////////////////////////////////////////////////////// AFFICHAGE DES CAMIONS DE BOMBEROS /////////////////////////////////////////////////
/*
function RecupVehicleIncendie(){ //récupère le véhicule d'urgence avec en plus un Id du feu
    fetch('http://localhost:8082/vehicle/getall')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        // Examine the text in the response
        response.json().then(function(data) {
          return data; //On renvoie tout le vehicule
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

function RecupFireFromidFire(){//récupère à partir de l'Id du feu, l'objet feu et retourne sa latitude et longitude
  x= RecupVehicleIncendie().idFire //On appelle la F qui renvoie tout le vehicule mais seulement l'Id du feu
  fetch('http://localhost:8082/simulation/fire/'+toString(x)) // Grace a l'id du feu, on recupere l'objet feu en entier
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        AffichageFeux(data);
        return data; //On renvoie l'objet feu
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}


*/
coords = [
  [
      4.827867,
      45.747472
  ],
  [
      4.828178,
      45.747835
  ],
  [
      4.828199,
      45.747859
  ],
  [
      4.82861,
      45.748359
  ],
  [
      4.828682,
      45.74844
  ],
  [
      4.829255,
      45.748258
  ],
  [
      4.829352,
      45.748228
  ],
  [
      4.829518,
      45.748185
  ],
  [
      4.829615,
      45.748095
  ],
  [
      4.829679,
      45.748021
  ],
  [
      4.829702,
      45.74793
  ],
  [
      4.829667,
      45.747869
  ],
  [
      4.829608,
      45.747798
  ],
  [
      4.829275,
      45.747413
  ],
  [
      4.829125,
      45.747235
  ],
  [
      4.828655,
      45.746646
  ],
  [
      4.828468,
      45.746446
  ],
  [
      4.828064,
      45.74597
  ],
  [
      4.827908,
      45.745667
  ],
  [
      4.827753,
      45.745439
  ],
  [
      4.827664,
      45.745302
  ],
  [
      4.8273,
      45.744754
  ],
  [
      4.820554,
      45.736817
  ],
  [
      4.820191,
      45.736402
  ],
  [
      4.81983,
      45.735969
  ],
  [
      4.819703,
      45.735823
  ],
  [
      4.819271,
      45.735324
  ],
  [
      4.81749,
      45.73325
  ],
  [
      4.817325,
      45.733046
  ],
  [
      4.817074,
      45.732757
  ],
  [
      4.816976,
      45.732632
  ],
  [
      4.816861,
      45.732493
  ],
  [
      4.816604,
      45.732221
  ],
  [
      4.816405,
      45.73198
  ],
  [
      4.815932,
      45.731428
  ],
  [
      4.815468,
      45.730856
  ],
  [
      4.815383,
      45.730661
  ],
  [
      4.815349,
      45.730539
  ],
  [
      4.815327,
      45.730426
  ],
  [
      4.815321,
      45.730316
  ],
  [
      4.815359,
      45.730136
  ],
  [
      4.815437,
      45.729963
  ],
  [
      4.815672,
      45.72961
  ],
  [
      4.815825,
      45.729339
  ],
  [
      4.815857,
      45.729275
  ],
  [
      4.815958,
      45.729048
  ],
  [
      4.816015,
      45.728895
  ],
  [
      4.816096,
      45.728613
  ],
  [
      4.816975,
      45.72546
  ],
  [
      4.817488,
      45.723464
  ],
  [
      4.818249,
      45.720234
  ],
  [
      4.818394,
      45.719743
  ],
  [
      4.818579,
      45.719282
  ],
  [
      4.818702,
      45.719022
  ],
  [
      4.818933,
      45.718565
  ],
  [
      4.820252,
      45.716107
  ],
  [
      4.820463,
      45.715722
  ],
  [
      4.820773,
      45.715213
  ],
  [
      4.821128,
      45.714616
  ],
  [
      4.821224,
      45.714487
  ],
  [
      4.821443,
      45.714192
  ],
  [
      4.821741,
      45.713849
  ],
  [
      4.822146,
      45.7134
  ],
  [
      4.822486,
      45.713079
  ],
  [
      4.822835,
      45.712776
  ],
  [
      4.823159,
      45.712511
  ],
  [
      4.823465,
      45.71229
  ],
  [
      4.823788,
      45.712052
  ],
  [
      4.824161,
      45.711806
  ],
  [
      4.82455,
      45.711585
  ],
  [
      4.824966,
      45.711353
  ],
  [
      4.825716,
      45.711001
  ],
  [
      4.826719,
      45.710526
  ],
  [
      4.827363,
      45.71022
  ],
  [
      4.827569,
      45.710116
  ],
  [
      4.827835,
      45.709981
  ],
  [
      4.828067,
      45.709849
  ],
  [
      4.828278,
      45.709721
  ],
  [
      4.828577,
      45.709515
  ],
  [
      4.828786,
      45.709346
  ],
  [
      4.829015,
      45.709153
  ],
  [
      4.829194,
      45.708975
  ],
  [
      4.829641,
      45.708519
  ],
  [
      4.830291,
      45.707854
  ],
  [
      4.831303,
      45.70676
  ],
  [
      4.832772,
      45.705276
  ],
  [
      4.833391,
      45.704622
  ],
  [
      4.834289,
      45.703714
  ],
  [
      4.834519,
      45.703444
  ],
  [
      4.834726,
      45.703184
  ],
  [
      4.834864,
      45.702914
  ],
  [
      4.83497,
      45.702682
  ],
  [
      4.835067,
      45.702379
  ],
  [
      4.835161,
      45.70205
  ],
  [
      4.835246,
      45.701653
  ],
  [
      4.835486,
      45.700579
  ],
  [
      4.835562,
      45.700383
  ],
  [
      4.835699,
      45.699761
  ],
  [
      4.83576,
      45.69937
  ],
  [
      4.835936,
      45.698925
  ],
  [
      4.836143,
      45.698543
  ],
  [
      4.836357,
      45.698246
  ],
  [
      4.83657,
      45.697938
  ],
  [
      4.836799,
      45.697679
  ],
  [
      4.837064,
      45.697435
  ],
  [
      4.83738,
      45.69719
  ],
  [
      4.837715,
      45.696965
  ],
  [
      4.838118,
      45.696718
  ],
  [
      4.838307,
      45.696606
  ],
  [
      4.842613,
      45.694138
  ],
  [
      4.843424,
      45.693674
  ],
  [
      4.843522,
      45.693542
  ],
  [
      4.843667,
      45.693435
  ],
  [
      4.843789,
      45.693337
  ],
  [
      4.843949,
      45.693214
  ],
  [
      4.844029,
      45.693117
  ],
  [
      4.844063,
      45.693017
  ],
  [
      4.844043,
      45.692945
  ],
  [
      4.843966,
      45.692855
  ],
  [
      4.843833,
      45.69279
  ],
  [
      4.843709,
      45.692775
  ],
  [
      4.843562,
      45.692795
  ],
  [
      4.843441,
      45.692861
  ],
  [
      4.843336,
      45.692967
  ],
  [
      4.843271,
      45.693086
  ],
  [
      4.843238,
      45.693215
  ],
  [
      4.84325,
      45.693366
  ],
  [
      4.8433,
      45.693518
  ],
  [
      4.843363,
      45.693627
  ],
  [
      4.843505,
      45.693937
  ],
  [
      4.843635,
      45.694117
  ],
  [
      4.843784,
      45.694254
  ],
  [
      4.843914,
      45.694361
  ],
  [
      4.844081,
      45.694479
  ],
  [
      4.844194,
      45.694537
  ],
  [
      4.844501,
      45.694725
  ],
  [
      4.844587,
      45.694818
  ],
  [
      4.844686,
      45.694981
  ],
  [
      4.844704,
      45.695144
  ],
  [
      4.844706,
      45.695215
  ],
  [
      4.844728,
      45.69538
  ],
  [
      4.844797,
      45.695674
  ],
  [
      4.844884,
      45.69615
  ],
  [
      4.845375,
      45.697472
  ],
  [
      4.845401,
      45.697729
  ],
  [
      4.845467,
      45.697971
  ],
  [
      4.845547,
      45.698309
  ],
  [
      4.845599,
      45.698575
  ],
  [
      4.845661,
      45.698937
  ],
  [
      4.845691,
      45.699299
  ],
  [
      4.845696,
      45.699825
  ],
  [
      4.845696,
      45.699825
  ]
];
  
  
  function displayJourneyReshaped(coords) {
  var pointList = [];
  coords.forEach(coord => {
  pointList.push(new L.LatLng(coord[1], coord[0]));
  });
  
  var firstpolyline = new L.Polyline(pointList, {
  color: 'blue',
  weight: 3.5,
  opacity: 0.8,
  smoothFactor: 1
  
  });
  
  map.addLayer(firstpolyline);
  firstpolyline.addTo(itineraire);
  }

displayJourneyReshaped(coords);



