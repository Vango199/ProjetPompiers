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

function displayInfoVehiculeMap(){

  fetch('http://localhost:8081/vehicle')
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
  console.log('tot');
  setTimeout(displayInfoVehiculeMap, 1000);

}

function displayVehicle(body){
  console.log(body)
  if(!flag){
    mapIdVehicleLayerOld = new Map();
    console.log(flag);
    flag = true;
  }
  mapIdVehicleLayerNew = new Map();
  for(const vehicle of body){
      if (!mapIdVehicleLayerOld.has(vehicle.id)){
          console.log('TOTOTO')
          var Vehicle = L.marker([vehicle.lat, vehicle.lon])
          Vehicle.addTo(map);
          console.log('TATATA')
              Vehicle.bindPopup("Id : " + vehicle.id + "<br>Type : " + vehicle.type + "<br>Liquid Load : " + vehicle.liquidType +" " +vehicle.liquidQuantity + "L<br>" + "Fuel : "+ vehicle.fuel+ "<br><button type='button' id="+vehicle.id+' onclick=deleteVehicle(this.id)>Supprimer</button>');
              

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
                 
  }
    mapIdVehicleLayerOld.forEach(function(value, key) {
    //console.log("Deleting unnecessary Vehicle Markers");
    map.removeLayer(value[2]);
    mapIdVehicleLayerOld.delete(key);
    });
mapIdVehicleLayerOld = new Map(mapIdVehicleLayerNew);  
}



function deleteVehicle(id){
  const context = {
      method: 'DELETE'
  }
  fetch('http://localhost:8082/vehicle/'+id, context)
}

TruckTypeSelect = '<label for="TruckType">Choose a type of car :<br></label><select id="TruckType" name="TruckType"><option value="CAR">CAR</option><option value="WATER_TENDERS">WATER_TENDERS</option><option value="TURNTABLE_LADDER_TRUCK">TURNTABLE_LADDER_TRUCK</option><option value="TRUCK">TRUCK</option><option value="FIRE_ENGINE">FIRE_ENGINE</option><option value="PUMPER_TRUCK">PUMPER_TRUCK</option></select>';    
LiquidTypeSelect = '<label for="LiquidType">Choose a type of liquid :</label><select id="LiquidType" name="LiquidType"><option value="ALL">ALL</option><option value="WATER">WATER</option><option value="WATER_WITH_ADDITIVES">WATER_WITH_ADDITIVES</option><option value="CARBON_DIOXIDE">CARBON_DIOXIDE</option><option value="POWDER">POWDER</option></select>';
LatEnter = '<label for="POST-lat">Latitude :</label><input id="POST-lat" type="text" name="POST-lat"></input>';
LonEnter = '<label for="POST-lon">Longitude :</label><input id="POST-lon" type="text" name="POST-lon"></input>';
var AddPopup = L.popup().setContent('<b>Choisissez votre véhicule :</b><br><form onsubmit=AddVehicle(event) method="POST" id="AddVehicle">'+LatEnter +'<br>' + LonEnter + '<br>' + TruckTypeSelect+'<br>'+LiquidTypeSelect+'<br><input type="submit"></form>');

AddButton = L.easyButton('<img title = "Add a vehicle" src="../Img/my-icon.png" height=16 width=24 lenght=9>', function(btn, imap){AddPopup.setLatLng(imap.getCenter()).openOn(imap); }).addTo(map);
      
function AddVehicle(event){
  event.preventDefault();
  var DataVehicule = document.getElementById("AddVehicule");
  var charge = {
      
      "lon": document.getElementById('POST-lat').value,
      "lat": document.getElementById('POST-lon').value,
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
  console.log(charge);
  const context = {
      method:'POST',
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify( charge ) 
  }
  fetch("http://localhost:8081/vehicle", context)
      
}

function UpdateVehicle(event){
  event.preventDefault();
  var DataVehicule = document.getElementById("AddVehicule");
  var charge = {
      
      "lon": 4.828066,
      "lat": 45.747389,
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
  console.log(charge);
  const context = {
      method:'POST',
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify( charge ) 
  }
  fetch("http://localhost:8081/vehicle", context)
      
}

displayInfoVehiculeMap();