/* 
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
*/
  
////////////////////////////////////////////////////// AFFICHAGE DES CAMIONS DE BOMBEROS /////////////////////////////////////////////////

flag = false;

 //// AJOUT THOMAS : LES ICON 
 
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
        displayVehicle(data)
        return;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  setTimeout(displayInfoVehiculeMap, 1000);

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
          Vehicle.addTo(map);
          Vehicle.bindPopup("Id : " + vehicle.id + "<br>Etat :"+vehicle.etat+"<br>Type : " + vehicle.type + "<br>Liquid Load : " + vehicle.liquidType + " " + vehicle.liquidQuantity + "L<br>" + "Fuel : " + vehicle.fuel + "<br><button type='button' id=" + vehicle.id + " onclick=deleteVehicle(this.id)>Supprimer</button><button id=" + vehicle.id + " type='button' onclick=editVehicle(this.id,"+vehicle.lat+","+vehicle.lon+")>Modifier</button>");
              

              if(vehicle.type == "CAR"){
                  Vehicle.setIcon(CarIcon);
              }
              if(vehicle.type == "FIRE_ENGINE"){
                  Vehicle.setIcon(FiretruckIcon);
              }
              if(vehicle.type == "PUMPER_TRUCK"){
                  Vehicle.setIcon(PumperTruckIcon);
              }
              if(vehicle.type == "WATER_TENDER"){
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
    mapIdVehicleLayerOld.get(vehicle.id)[2].setLatLng(L.latLng(vehicle.lat,vehicle.lon))
    mapIdVehicleLayerNew.set(vehicle.id,[mapIdVehicleLayerOld.get(vehicle.id)[0],mapIdVehicleLayerOld.get(vehicle.id)[1],mapIdVehicleLayerOld.get(vehicle.id)[2],mapIdVehicleLayerOld.get(vehicle.id)[3],mapIdVehicleLayerOld.get(vehicle.id)[4],mapIdVehicleLayerOld.get(vehicle.id)[5]]);
    mapIdVehicleLayerOld.delete(vehicle.id);
    }

    //if (vehicle.idFire != 0){
    //  RecupCoord();
 // }

                 
  }
  


    mapIdVehicleLayerOld.forEach(function(value, key) {
    //console.log("Deleting unnecessary Vehicle Markers");
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

TruckTypeSelect = '<label for="TruckType">Choose a type of car :<br></label><select id="TruckType" name="TruckType"><option value="CAR">CAR</option><option value="WATER_TENDERS">WATER_TENDERS</option><option value="TURNTABLE_LADDER_TRUCK">TURNTABLE_LADDER_TRUCK</option><option value="TRUCK">TRUCK</option><option value="FIRE_ENGINE">FIRE_ENGINE</option><option value="PUMPER_TRUCK">PUMPER_TRUCK</option></select>';    
LiquidTypeSelect = '<label for="LiquidType">Choose a type of liquid :</label><select id="LiquidType" name="LiquidType"><option value="ALL">ALL</option><option value="WATER">WATER</option><option value="WATER_WITH_ADDITIVES">WATER_WITH_ADDITIVES</option><option value="CARBON_DIOXIDE">CARBON_DIOXIDE</option><option value="POWDER">POWDER</option></select>';
LatEnter = '<label for="POST-lat">Latitude :</label><input id="POST-lat" type="text" name="POST-lat"></input>';
LonEnter = '<label for="POST-lon">Longitude :</label><input id="POST-lon" type="text" name="POST-lon"></input>';
var AddPopup = L.popup().setContent('<b>Choisissez votre véhicule :</b><br><form onsubmit=AddVehicle(event) method="POST" id="AddVehicle">'+LatEnter +'<br>' + LonEnter + '<br>' + TruckTypeSelect+'<br>'+LiquidTypeSelect+'<br><input type="submit"></form>');

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
      "facilityRefID": 0
  }
  const context = {
      method:'POST',
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify( charge ) 
  }
  fetch("http://localhost:8082/vehicle", context)
      
}





////////////// AJOUT THOMAS CE WEEKEND : CES DEUX FONTIONS ////////
function editVehicle(id,lat,lon) {

  TruckTypeSelect = '<label for="TruckTypeEdit">Choose a type of car :<br></label><select id="TruckTypeEdit" name="TruckTypeEdit"><option value="CAR">CAR</option><option value="WATER_TENDERS">WATER_TENDERS</option><option value="TURNTABLE_LADDER_TRUCK">TURNTABLE_LADDER_TRUCK</option><option value="TRUCK">TRUCK</option><option value="FIRE_ENGINE">FIRE_ENGINE</option><option value="PUMPER_TRUCK">PUMPER_TRUCK</option></select>';
  LiquidTypeSelect = '<label for="LiquidTypeEdit">Choose a type of liquid :<br></label><select id="LiquidTypeEdit" name="LiquidTypeEdit"><option value="ALL">ALL</option><option value="WATER">WATER</option><option value="WATER_WITH_ADDITIVES">WATER_WITH_ADDITIVES</option><option value="CARBON_DIOXIDE">CARBON_DIOXIDE</option><option value="POWDER">POWDER</option></select>';
  //CaserneNumber = '<label for="CaserneNumber">Choose a firehouse number(max 10 firehouses):<br></label><input type="number" id="CaserneEdit" name="CaserneEdit" min="0" value = "0" max="10" step="1">';
  FuelEdit = '<br><label for="FuelEdit">Fuel:</label><br><input type="number" id="FuelEdit" name="FuelEdit" min="0" max="100" value="100>';
  var EditPopup = L.popup().setContent('Define what vehicule you desire<br><form onsubmit=UpdateVehicle(event,' + id + ') method="POST" id="UpdateVehicle">' + TruckTypeSelect + '<br>' + LiquidTypeSelect + '<br>' +FuelEdit+ '<br><label for="latEdit"> <br> Latitude (between 45.666 and 45.8373):</label><br><input type="number" id="latEdit" name="latEdit" min="45.666" max="45.8373" value = "'+lat+'" step="0.0001"><br><label for="lonEdit">Longitude (between 4.688 and 4.97):</label><br><input type="number" id="lonEdit" name="lonEdit" min="4.688" max="4.97" value = "'+lon+'" step="0.001"><input type="submit"></form>');
  EditPopup.setLatLng(map.getCenter()).openOn(map);
}
function UpdateVehicle(event, id) {
  event.preventDefault();
  map.closePopup();
  var charge = {
      "id": id,
      "lon": document.getElementById('lonEdit').value,
      "lat": document.getElementById('latEdit').value,
      "type": document.getElementById('TruckTypeEdit').value,
      "efficiency": 10.0,
      "liquidType": document.getElementById('LiquidTypeEdit').value,
      "liquidQuantity": 100.0,
      "liquidConsumption": 0.1,
      "fuel": document.getElementById('FuelEdit').value,
      "fuelConsumption": 10.0,
      "crewMember": 8,
      "crewMemberCapacity": 8,
      "facilityRefID": 0 //document.getElementById('CaserneEdit').value
  }
  const context = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(charge)
  }
  fetch("http://localhost:8082/Vehicule/modif/" + id, context)

}




displayInfoVehiculeMap();
