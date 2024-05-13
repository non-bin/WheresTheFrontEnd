// if ?dev=true, use local API, otherwise use production API
const DEV = new URLSearchParams(window.location.search).get('dev') === 'true';

const API_URL = DEV ? 'http://localhost:8787' : 'https://api.wheresthe.net';
const UPDATE_INTERVAL = DEV ? 5000 : 15000;

const map = L.map('map').setView([-37.810175, 144.970194], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const tramIcon = L.icon({
  iconUrl: 'https://vicroadsopendatastorehouse.vicroads.vic.gov.au/opendata/Public_Transport/Pictograms/PICTO-MODE-Tram.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [15, 0],
});

var markers = {
  trams: []
};

markers.user = {
  marker: L.circleMarker([0, 0], {
    size: 5,
    color: 'blue',
    fill: true,
    fillColor: 'blue',
    fillOpacity: 1
  }),
  accuracy: L.circle([0, 0], {
    size: 50,
    stroke: true,
    fill: true,
    fillColor: 'lightBlue',
    fillOpacity: 0.5
  }),
  update: function (lat, lon, accuracy = false) {
    this.marker.setLatLng([lat, lon]);
    this.accuracy.setLatLng([lat, lon]);

    if (accuracy) this.accuracy.setRadius(accuracy);

    console.log(this.marker);
    if (!this.marker._map) {
      this.accuracy.addTo(map).bringToFront();
      this.marker.addTo(map).bringToFront();
    }
  }
};

if ('geolocation' in navigator) {
  console.log('Geolocation available');
  markers.user.update(-37.810175, 144.970194, 1000);
  // Set initial position (inacurate, fast as possible)
  navigator.geolocation.getCurrentPosition((position) => {
    console.log('Initial position:', position.coords.latitude, position.coords.longitude, position.coords.accuracy);
    markers.user.update(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
  });

  // Update position (accurate, slow)
  navigator.geolocation.watchPosition((position) => {
    console.log('Updated position:', position.coords.latitude, position.coords.longitude, position.coords.accuracy);
    markers.user.update(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
    // doSomething(position.coords.latitude, position.coords.longitude);
  }, null, { enableHighAccuracy: true });
}

update();
setInterval(() => {
  update();
}, UPDATE_INTERVAL);

function update() {
  fetch(API_URL + '/yarraTrams', {
    method: 'GET'
  }).then((response) => {
    if (response.status !== 200) {
      console.log('Error fetching data');
      alert('Error fetching data'); // TODO: better error handling
      return;
    }

    response.json().then((data) => {
      let debugLayerCount = 0;
      map.eachLayer(() => {
        debugLayerCount++;
      });
      console.log('Layer count:', debugLayerCount);
      console.log('Trams:', markers.trams.length);

      for (let i = 0; i < markers.trams.length; i++) {
        map.removeLayer(markers.trams[i]);
      }
      markers.trams = [];

      for (let i = 0; i < data.entity.length; i++) {
        const position = data.entity[i].vehicle.position;
        markers.trams.push(L.marker([position.latitude, position.longitude], { icon: tramIcon }).addTo(map));
      }
    });
  });
}
