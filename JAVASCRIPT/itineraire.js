

map_poly = new Map();

  function RecupCoord(IdV){ 
    fetch('http://localhost:8082/vehicle/'+IdV)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        // Examine the text in the response
        response.json().then(function(data) {
          if (data.idFire != 0 && !(map_poly.has(data.id))&& (data.etat == "versFeu")) { //Si le véhicule est associé à un feu :
            console.log(data)
            displayJourneyReshaped(data.trajet, data.id);
          }

          return data;
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}


function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

function displayJourneyReshaped(body, id) {
    var pointList = [];
    body.forEach(x => {
    pointList.push(new L.LatLng(x.lat, x.lon));
    });
    
    var firstpolyline = new L.Polyline(pointList, {
    color : randomChoice(['red', 'blue', 'green', 'cyan', 'purple']),
    weight: 3.5,
    opacity: 0.8,
    smoothFactor: 1
    
    });
    
    map.addLayer(firstpolyline);
    firstpolyline.addTo(Itineraire);
    map_poly.set(id,firstpolyline);


    }



    function test_iti(data) { // test si le véhicule est arrivé au bout de son itinéraire, pour remove le layer
        if ( map_poly.has(data.id) ) { // On test si l'id est déjà dans le dico ou pas
          map.removeLayer(map_poly.get(data.id)); // dans ce cas, on remove le layer de l'itinéraire car on est arrivé
          Itineraire.removeLayer(map_poly.get(data.id));
          map_poly.delete(data.id);
        } 
    }
  


