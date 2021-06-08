function AffichageCasernes(){


    fetch('http://localhost:8082/caserne/getall')
    .then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            return;
        }
    
        // Examine the text in the response
        response.json().then(function(data) {
            console.log(data)
            DisplayCaserne(data);
        //   AffichageFeux(data);
            return data;
        });
        }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}









var CaserneIcon = new L.Icon({
    iconUrl: '../Img/caserne-de-pompiers.png',
    iconSize:     [30, 30],
    iconAnchor: new L.Point(16, 16),
    });

function DisplayCaserne(body) {
     
    body.forEach(element => x=[element.lat, element.lon]);
        var Caserne = L.marker(x)
        Caserne.addTo(map)
    Caserne.bindPopup('Je suis une caserne');
    Caserne.setIcon(CaserneIcon);
           

}
AffichageCasernes();