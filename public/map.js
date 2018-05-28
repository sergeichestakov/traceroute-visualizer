mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2VpY2hlc3Rha292IiwiYSI6ImNqNGs2NzdxMzBnMWYyd3FqOWlxd2N1ZWkifQ.cVaGTeATJmDDq6ULte67MQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-121.74, 38.54], // starting position
    zoom: 6 // starting zoom
});

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

const form = document.getElementById('form');

form.addEventListener('submit', e => {
    e.preventDefault();
    const searchBar = document.getElementById('search-bar')
    const value = searchBar.value
    if(value) { //Send nonempty value to server
		const request = new XMLHttpRequest();
		request.open('POST', '/request', true);
		request.setRequestHeader('Content-Type', 'application/json')
		request.send(JSON.stringify({
			value: value
		}));
    }
    searchBar.value = '' //Reset
}, false);
