mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2VpY2hlc3Rha292IiwiYSI6ImNqNGs2NzdxMzBnMWYyd3FqOWlxd2N1ZWkifQ.cVaGTeATJmDDq6ULte67MQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-121.74, 38.54], // starting position
    zoom: 4 // starting zoom
});

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a GeoJSON source with an empty lineString.
let geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                []
            ]
        }
 	}]
}

const animatePath = (coordinates) => {
	// start by showing just the first coordinate
	geojson.features[0].geometry.coordinates = [coordinates[0]];
	const trace = 'trace'

	// Remove previous line
	if (map.getLayer(trace)){
		map.removeLayer(trace)
		map.removeSource(trace)
	}

	// add it to the map
	map.addSource(trace , { type: 'geojson', data: geojson });
	map.addLayer({
		"id": trace,
		"type": "line",
		"source": "trace",
		"paint": {
			"line-color": "red",
			"line-opacity": 0.75,
			"line-width": 5
		}
	});

	// setup the viewport
	map.jumpTo({ 'center': coordinates[0], 'zoom': 4 });

	// on a regular basis, add more coordinates from the saved list and update the map
	let index = 0
	const timer = setInterval(() => {
		if (index < coordinates.length) {
			geojson.features[0].geometry.coordinates.push(coordinates[index]);
			map.getSource('trace').setData(geojson);
			map.panTo(coordinates[index]);
			index++;
		} else {
			clearInterval(timer)
		}
	}, 1500)
}

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
					let coords = []
                   	for(const key in data){
						const lat = data[key].lat
						const lon = data[key].lon

						if(lat && lon){
							coords.push([lon, lat]);
						}
					}
            		animatePath(coords)
                })
            }
        })
    }
    searchBar.value = '' //Reset
}, false);
