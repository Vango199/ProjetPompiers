let map = null;

function init() {
    console.log('inside init');
    const Lyon = {
        lat: 45.75,
        lng: 4.85
    }
    const zoomLevel = 11;

    map = L.map('mapid').setView([Lyon.lat, Lyon.lng], zoomLevel);

    const mainLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoidG90by1ldC1nYWJvdSIsImEiOiJja3BlMTJwMHIwM2RvMndvNjVjNWcyeTdkIn0.8DWPSvTRKHCwUmXACaZP0w'
    });
    
    mainLayer.addTo(map);

  GetAllFire();

}

function GetAllFire(){ //appel de la liste avec tous les feux
    console.log("toto")
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
          console.log(data);
          AffichageFeux(data);
          return data;
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}



function AffichageFeux(AllFireList){
    //AllFireList =   GetAllFire();//appel de la fonction qui retourne une liste de feux

//On parcourt la liste des feux pour venir les afficher sur la map

console.log('le poulet');
console.log(AllFireList);
for (i in AllFireList){
  console.log(i);
  x = perc2color((AllFireList[i].intensity)*2)
  console.log(x);
  console.log(x);
     var circle = L.circle([AllFireList[i].lat, AllFireList[i].lon], { //Pb format JSON
     
        color: x,
        fillColor: x,
        fillOpacity: 0.8,
        radius: AllFireList[i].range
    }).addTo(map);
    circle.bindPopup(AffichageDonneeFeux(AllFireList[i]))
}
}

function perc2color(perc) { //Création d'une échelle de couleurs en fonction de l'intensité du feu
	var r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}

function AffichageDonneeFeux(Feux){
  y = 'id :' + Feux.id + ', intensity :' + Feux.intensity + ', range :' + Feux.range + ', Type :' + Feux.type;
  return y.toString()

}