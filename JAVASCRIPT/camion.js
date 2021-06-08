////////////////////////////////////////////////////// AFFICHAGE DES CAMIONS DE BOMBEROS /////////////////////////////////////////////////

flag = false;


 ///// AJOUT THOMAS : LES ICON 
 
var FiretruckIcon = new L.Icon({
  iconUrl: '../Img/firetruck.png',
  iconSize:     [30, 30],
  iconAnchor: new L.Point(16, 16),
  });
var CarIcon = new L.Icon({
  iconUrl: '../Img/car.png',
  iconSize:     [30, 30],
  iconAnchor: new L.Point(16, 16),
  });
var PumperTruckIcon = new L.Icon({
  iconUrl: '../Img/pumptruck.png',
  iconSize:     [30, 30],
  iconAnchor: new L.Point(16, 16),
  });
var WaterTenderIcon = new L.Icon({
  iconUrl: '../Img/tendertruck.png',
  iconSize:     [30, 30],
  iconAnchor: new L.Point(16, 16),
  });
var LadderTruckIcon = new L.Icon({
  iconUrl: '../Img/laddertruck.png',
  iconSize:     [30, 30],
  iconAnchor: new L.Point(16, 16),
  });    
var TruckIcon = new L.Icon({
  iconUrl: '../Img/truck.png',
  iconSize:     [30, 30],
  iconAnchor: new L.Point(16, 16),
  });






function displayInfoVehiculeMap(){

  fetch('http://localhost:8082/vehicle/getall')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function(data) {
        displayVehicle(data);
        setTimeout(displayInfoVehiculeMap, TempsdeRefresh);
        return;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function displayVehicle(body){
  if(!flag){
    mapIdVehicleLayerOld = new Map();
    flag = true;
  }
  
  mapIdVehicleLayerNew = new Map();
  for(const vehicle of body){
      if (!mapIdVehicleLayerOld.has(vehicle.id)){
          var Vehicle = L.marker([vehicle.lat, vehicle.lon])
          console.log('test'+vehicle.lon, vehicle.lat, vehicle.id)
          Vehicle.addTo(map);
          Vehicle.bindPopup("Id : " + vehicle.id + "<br>Etat :"+vehicle.etat+"<br>Type : " + vehicle.type + "<br>Liquid Load : " + vehicle.liquidType + " " + vehicle.liquidQuantity + "L<br>" + "Fuel : " + vehicle.fuel + "<br><button type='button' id=" + vehicle.id + " onclick=deleteVehicle(this.id)>Supprimer</button>");
              

              if(vehicle.type == "CAR"){
                  Vehicle.setIcon(CarIcon);
              }
              if(vehicle.type == "FIRE_ENGINE"){
                  Vehicle.setIcon(FiretruckIcon);
              }
              if(vehicle.type == "PUMPER_TRUCK"){
                  Vehicle.setIcon(PumperTruckIcon);
              }
              if(vehicle.type == "WATER_TENDERS"){
                  Vehicle.setIcon(WaterTenderIcon);
              }
              if(vehicle.type == "TURNTABLE_LADDER_TRUCK"){
                  Vehicle.setIcon(LadderTruckIcon);
              }
              if(vehicle.type == "TRUCK"){
                  Vehicle.setIcon(TruckIcon);
              }


      mapIdVehicleLayerNew.set(vehicle.id,[vehicle.type,vehicle.liquidType,Vehicle,vehicle.facilityRefID,vehicle.liquidQuantity,vehicle.fuel])
    }  
    else{
    mapIdVehicleLayerOld.get(vehicle.id)[2].setLatLng(L.latLng(vehicle.lat,vehicle.lon));
    mapIdVehicleLayerOld.get(vehicle.id)[2].getPopup().setContent("Id : " + vehicle.id + "<br>Etat :"+vehicle.etat+"<br>Type : " + vehicle.type + "<br>Liquid Load : " + vehicle.liquidType + " " + vehicle.liquidQuantity + "L<br>" + "Fuel : " + vehicle.fuel + "<br><button type='button' id=" + vehicle.id + " onclick=deleteVehicle(this.id)>Supprimer</button>");
    mapIdVehicleLayerNew.set(vehicle.id,[mapIdVehicleLayerOld.get(vehicle.id)[0],mapIdVehicleLayerOld.get(vehicle.id)[1],mapIdVehicleLayerOld.get(vehicle.id)[2],mapIdVehicleLayerOld.get(vehicle.id)[3],mapIdVehicleLayerOld.get(vehicle.id)[4],mapIdVehicleLayerOld.get(vehicle.id)[5]]);
    mapIdVehicleLayerOld.delete(vehicle.id);
    }
    if (vehicle.idFire != 0){ // si le camion est associé à un feu (donc va se déplacer)
    RecupCoord(vehicle.id)
    }   
    if (vehicle.etat == 'EteindFeu'){ // si il est en train d'éteindre le feu, on envoie a test_iti pour supprimer l'itinéraire sur la map
      test_iti(vehicle);
    }          
  }
  


    mapIdVehicleLayerOld.forEach(function(value, key) {
    map.removeLayer(value[2]);
    mapIdVehicleLayerOld.delete(key);
    });
mapIdVehicleLayerOld = new Map(mapIdVehicleLayerNew);  
}



function deleteVehicle(id){
  map.closePopup();
  const context = {
      method: 'DELETE'
  }
  fetch('http://localhost:8082/vehicle/deletevehicle/'+id, context)
}

CaserneNumber = '<label for="CaserneNumber">Choose a firehouse (max 3 firehouses):<br></label><input type="number" id="Caserne" name="Caserne" min="1" max="3" value= "1" step="1">';
TruckTypeSelect = '<label for="TruckType">Choose a type of car :<br></label><select id="TruckType" name="TruckType"><option value="CAR">CAR</option><option value="WATER_TENDERS">WATER_TENDERS</option><option value="TURNTABLE_LADDER_TRUCK">TURNTABLE_LADDER_TRUCK</option><option value="TRUCK">TRUCK</option><option value="FIRE_ENGINE">FIRE_ENGINE</option><option value="PUMPER_TRUCK">PUMPER_TRUCK</option></select>';    
LiquidTypeSelect = '<label for="LiquidType">Choose a type of liquid :</label><select id="LiquidType" name="LiquidType"><option value="ALL">ALL</option><option value="WATER">WATER</option><option value="WATER_WITH_ADDITIVES">WATER_WITH_ADDITIVES</option><option value="CARBON_DIOXIDE">CARBON_DIOXIDE</option><option value="POWDER">POWDER</option></select>';
LatEnter = '<label for="POST-lat">Latitude : (Entre 45.65 et 45.82)</label><input id="POST-lat" type="number" name="POST-lat" min="45.65" max="45.82" step="0.01" value="45.75" value=></input>';
LonEnter = '<label for="POST-lon">Longitude : (Entre 4.70 et 5.10) </label><input id="POST-lon" type="number" name="POST-lon" min="4.70" max="5.00" step="0.01" value="4.80"></input>';
var AddPopup = L.popup().setContent('<b>Choisissez votre véhicule :</b><br><form onsubmit=AddVehicle(event) method="POST" id="AddVehicle">'+LatEnter +'<br>' + LonEnter + '<br>' + TruckTypeSelect+'<br>'+LiquidTypeSelect+'<br>'+ CaserneNumber+'<br> <input type="submit"></form>');

AddButton = L.easyButton('<img title = "Add a vehicle" src="../Img/my-icon.png" height=16 width=24 lenght=9>', function(btn, imap){AddPopup.setLatLng(imap.getCenter()).openOn(imap); }).addTo(map);
      
function AddVehicle(event){
  event.preventDefault();
  map.closePopup();
  var DataVehicule = document.getElementById("AddVehicule");
  var charge = {
      "id": 40.0,
      "lon": document.getElementById('POST-lon').value,
      "lat": document.getElementById('POST-lat').value,
      "type": document.getElementById('TruckType').value,
      "efficiency": 10.0,
      "liquidType": document.getElementById('LiquidType').value,
      "liquidQuantity": 100.0,
      "liquidConsumption": 1.0,
      "fuel": 100.0,
      "fuelConsumption": 10.0,
      "crewMember": 8,
      "crewMemberCapacity": 8,
      "facilityRefID": 0,
      "idCaserne" : 1

  }
  const context = {
      method:'POST',
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify( charge ) 
  }
  fetch("http://localhost:8082/vehicle/add", context)
      
}



displayInfoVehiculeMap();