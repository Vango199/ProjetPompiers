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