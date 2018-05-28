const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const traceroute = require('traceroute');

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>
    res.sendFile('index.html')
)

app.post('/request', (req, res) => {
	const value = req.body.value
    console.log(value)
	traceroute.trace(value, (err,hops) => {
		if (err) { //Handle error
			console.log(err)
		}
		//Iterate through return JSON and extract IPs
		for (const hopKey in hops) {
			const hop = hops[hopKey]
			for (const IP in hop) {
				console.log('IP:', IP)
			}
		}

	});
})

app.listen(3000, () => console.log('Listening on port 3000!'))
