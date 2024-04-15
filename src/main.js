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

var trams = [];
update();
setInterval(() => {
  update();
}, 15000);

function update() {
  fetch('https://wheresthebackend.alicej.workers.dev', {
    method: 'GET',
    // Request headers
    headers: {
      'Cache-Control': 'no-cache'
    }
  }).then((response) => {
    if (response.status !== 200) {
      console.log('Error fetching data'); // TODO: visual error message
      return;
    }

    response.json().then((data) => {
      for (let i = 0; i < trams.length; i++) {
        trams[i].remove();
      }
      trams = [];

      for (let i = 0; i < data.entity.length; i++) {
        const position = data.entity[i].vehicle.position;
        L.marker([position.latitude, position.longitude], {icon: tramIcon}).addTo(map);
      }
    });
  });
}
