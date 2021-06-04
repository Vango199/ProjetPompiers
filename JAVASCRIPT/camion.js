
////////////////////////////////////////////////////// AFFICHAGE DES CAMIONS DE BOMBEROS /////////////////////////////////////////////////


function displayInfoVehiculeMap(){
  const context = {
      method: 'GET'
  }
  fetch('http://localhost:8082/vehicle/getall', context)
      .then(response => response.json().then(body => displayVehicle(body)))
      .catch(error => console.log(error))
      setTimeout(displayInfoVehiculeMap, TempsdeRefresh);
}


function GetAllVehicle(){ //appel de la liste avec tous les feux
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
          displayVehicle(data);
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

function displayVehicle(body){

          mapIdVehiculeLayerNew = new Map();
          
          for(const vehicle of body){
              var Vehicle = L.marker([vehicle.lat, vehicle.lon], {
                  icon: FiretruckIcon
              }).addTo(map);
               Vehicle.bindPopup("Id : " + vehicle.id + "<br>Type : " + vehicle.type + "<br>Liquid Load : " + vehicle.liquidType + " " + vehicle.liquidQuantity + "L<br>" + "Fuel : " + vehicle.fuel + "<br><button type='button' id=" + vehicle.id + " onclick=deleteVehicle(this.id, this.lon, this.lat, this.type, this.efficiency, this.liqiudType, this.liquidQuantity, this.liquidConsumption, this.fuel, this.fuelConsumption, this.crewMember, this.crewMemberCapacity, this.facilityRefID)>Supprimer</button><button id=" + vehicle.id + " type='button' onclick=editVehicle(this.id)>Modifier</button>");

              

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
              
          }
}

function deleteVehicle(id, lon, lat, type, efficiency, liquidType, liquidQuantity, liquidConsumption, fuel, fuelConsumption, crewMember, crewMemberCapacity, facilityRefID) {
  mymap.closePopup();
  var charge_delete = {
    "id": id,
    "lon": lon,
    "lat": lat,
    "type": document.getElementById('TruckType').value,
    "efficiency": efficiency,
    "liquidType": document.getElementById('LiquidType').value,
    "liquidQuantity": liquidQuantity,
    "liquidConsumption": liquidConsumption,
    "fuel": fuel,
    "fuelConsumption": fuelConsumption,
    "crewMember": crewMemberCapacity,
    "crewMemberCapacity": crewMemberCapacity,
    "facilityRefID": facilityRefID
}
  const context = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        },
    body: JSON.stringify( charge_delete ) 
  }
  fetch('http://localhost:8082/vehicle/deletevehicle', context)
      .then()
      .catch(error => console.log(error))
}




TruckTypeSelect = '<label for="TruckType">Choose a type of car :<br></label><select id="TruckType" name="TruckType"><option value="CAR">CAR</option><option value="WATER_TENDERS">WATER_TENDERS</option><option value="TURNTABLE_LADDER_TRUCK">TURNTABLE_LADDER_TRUCK</option><option value="TRUCK">TRUCK</option><option value="FIRE_ENGINE">FIRE_ENGINE</option><option value="PUMPER_TRUCK">PUMPER_TRUCK</option></select>';    
LiquidTypeSelect = '<label for="LiquidType">Choose a type of liquid :</label><select id="LiquidType" name="LiquidType"><option value="ALL">ALL</option><option value="WATER">WATER</option><option value="WATER_WITH_ADDITIVES">WATER_WITH_ADDITIVES</option><option value="CARBON_DIOXIDE">CARBON_DIOXIDE</option><option value="POWDER">POWDER</option></select>';
LatEnter = '<label for="POST-lat">Latitude :</label><input id="POST-lat" type="text" name="POST-lat"></input>';
LonEnter = '<label for="POST-lon">Longitude :</label><input id="POST-lon" type="text" name="POST-lon"></input>';
var AddPopup = L.popup().setContent('<b>Choisissez votre véhicule :</b><br><form onsubmit=AddVehicle(event) method="POST" id="AddVehicle">'+LatEnter +'<br>' + LonEnter + '<br>' + TruckTypeSelect+'<br>'+LiquidTypeSelect+'<br><input type="submit"></form>');

AddButton = L.easyButton('<img title = "Add a vehicle" src="../Img/my-icon.png" height=16 width=24 lenght=9>', function(btn, imap){

AddPopup.setLatLng(imap.getCenter()).openOn(imap); 

}).addTo(map);


      
function AddVehicle(event){
  event.preventDefault();
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
  console.log(charge);
  const context = {
      method:'POST',
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify( charge ) 
  }
  fetch("http://localhost:8082/vehicle", context)
      
}




  displayInfoVehiculeMap();
