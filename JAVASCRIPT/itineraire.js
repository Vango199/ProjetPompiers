  function RecupCoord(IdV){ //appel de la liste avec tous les feux
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
            console.log(data.trajet)
            displayJourneyReshaped(data.trajet);
       //   AffichageFeux(data);
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

function displayJourneyReshaped(body) {
    var pointList = [];
    body.forEach(x => {
        //console.log(x.id, x.lat, x.lon);
    pointList.push(new L.LatLng(x.lat, x.lon));
    });
    
    var firstpolyline = new L.Polyline(pointList, {
    color : randomChoice(['red', 'blue', 'green', 'black', 'white', 'yellow']),
    weight: 3.5,
    opacity: 0.8,
    smoothFactor: 1
    
    });
    
    map.addLayer(firstpolyline);
    firstpolyline.addTo(Itineraire);
    }


  


/*

    
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
  */

/*
  mapItiNew = new Map();
function displayJourneyReshaped(vehicule) {
    id = vehicule.id
    if(!mapItiNew.has(id)){
        const context = {
            method: 'GET'
        }
        fetch('http://localhost:8082/vehicle/getall', context)
            .then(response => response.json().then(body => displayIti(body,id)))
            .catch(error => console.log(error))
    }
    else{
        coordVehicule = new L.LatLng(vehicule.lat, vehicule.lon)
        if(mapItiNew.get(id)[2].length > 2){
            if(coordVehicule.distanceTo(mapItiNew.get(id)[2][1]) < 200){
                pointList = mapItiNew.get(id)[2];
                pointList.shift();
                map.removeLayer(mapItiNew.get(id)[0]);
                Itineraire.removeLayer(mapItiNew.get(id)[0]);
                var firstpolyline = new L.Polyline(pointList, {
                    color: mapItiNew.get(id)[1],
                    weight: 3,
                    opacity: 0.5,
                    smoothFactor: 1
                    });
                firstpolyline.addTo(Itineraire);
                firstpolyline.addTo(map);
                color = mapItiNew.get(id)[1],
                mapItiNew.delete(id)
                mapItiNew.set(id,[firstpolyline,color,pointList]);
            }
        }
        else if(mapItiNew.get(id)[2][mapItiNew.get(id)[2].length - 1].equals(coordVehicule)){
            map.removeLayer(mapItiNew.get(id)[0]);//we remove the marker from the map
            Itineraire.removeLayer(mapItiNew.get(id)[0]);
            mapItiNew.delete(id);//we delete the journey from the old map
        }
    }
    
}

function displayIti(body,id){
    var pointList = [];
    body.forEach(trajet => {
        pointList.push(new L.LatLng(trajet.lat, trajet.lon));
    });
    
    colorIti = colorAlea();
    var firstpolyline = new L.Polyline(pointList, {
        color: colorIti,
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    
        });
    firstpolyline.addTo(Itineraire);
    mapItiNew.set(id,[firstpolyline,colorIti,pointList]);
}

function colorAlea(){
    return ('#'+(Math.random()*0xFFFFFF<<0).toString(16))
}
*/
  