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
