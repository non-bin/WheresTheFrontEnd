// if ?dev=true, use local API, otherwise use production API
const DEV = new URLSearchParams(window.location.search).get('dev') === 'true';

const API_URL = DEV ? 'http://localhost:8787' : 'https://api.wheresthe.net';
const UPDATE_INTERVAL = DEV ? 5000 : 15000;

let map;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: new google.maps.LatLng(-37.810175, 144.970194),
    mapTypeId: "terrain",
  });
}

initMap();
window.initMap = initMap;

update();
// setInterval(() => {
//   update();
// }, UPDATE_INTERVAL);

async function update(data) {  
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const tramIcon = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: {lat: 37.4239163, lng: -122.0947209},
  });

  marker.addListener('click', ({domEvent, latLng}) => {
    const {target} = domEvent;
    // Handle the click event.
    // ...
  });

  // A marker with a with a URL pointing to a PNG.
  const tramIconImage = document.createElement("img").src = "https://vicroadsopendatastorehouse.vicroads.vic.gov.au/opendata/Public_Transport/Pictograms/PICTO-MODE-Tram.svg";

  const TramMarker = new AdvancedMarkerElement({
    map,
    position: { lat: 37.434, lng: -122.082 },
    content: tramIconImage,
    title: "A marker using a custom PNG Image",
  });

  // var markers = {
  //   trams: []
  // };
  for (let i = 0; i < results.features.length; i++) {
    const coords = results.features[i].geometry.coordinates;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    new google.maps.Marker({
      position: latLng,
      map: map,
    });
  }
};

// function update() {
//   fetch(API_URL + '/yarraTrams', {
//     method: 'GET'
//   }).then((response) => {
//     if (response.status !== 200) {
//       console.log('Error fetching data');
//       alert('Error fetching data'); // TODO: better error handling
//       return;
//     }

//     response.json().then((data) => {
//       let debugLayerCount = 0;
//       map.eachLayer(() => {
//         debugLayerCount++;
//       });
//       console.log('Layer count:', debugLayerCount);
//       console.log('Trams:', markers.trams.length);

//       for (let i = 0; i < markers.trams.length; i++) {
//         map.removeLayer(markers.trams[i]);
//       }
//       markers.trams = [];

//       for (let i = 0; i < data.entity.length; i++) {
//         const position = data.entity[i].vehicle.position;
//         markers.trams.push(L.marker([position.latitude, position.longitude], { icon: tramIcon }).addTo(map));
//       }
//     });
//   });
// }
