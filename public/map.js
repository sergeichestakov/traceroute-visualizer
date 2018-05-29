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
       fetch('/request', {
            method: 'POST',
            body: JSON.stringify({value: value}),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.ok) {
                res.json().then(data => {
                    console.log(data)
                })
            }
        })
    }
    searchBar.value = '' //Reset
}, false);
