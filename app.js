const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const traceroute = require('traceroute');
const request = require('request')

/* Geolocation API */
const ENDPOINT = 'https://api.apility.net/geoip_batch/'
const API_KEY = '57fb30d8-aa3d-4583-b63f-82a3774d64f3'

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(express.json())
app.use(express.static(__dirname + '/public'));

/* Serve HTML page with Map */
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

/* Process user submitted IP Address/Website from front end */
app.post('/request', (req, res) => {
    const value = req.body.value

	traceroute.trace(value, (err,hops) => {
		if (err) { //Send empty response and break
			res.json({})
			return
		}

        const IPs = extractIPs(hops)
        const requestStr = generateString(IPs)

        const URL = ENDPOINT + requestStr + '?token=' + API_KEY
        request.get(URL, (error, result, body) => {
            if(error) {
                console.log(error)
            } else {
                res.json(body)
            }
        })
	})
})

/* Iterate through returned JSON and extract IP Addresses */
const extractIPs = hops => {
    let IPs = []
    for (const hopKey in hops) {
        const hop = hops[hopKey]
		for (const IP in hop) {
            IPs.push(IP)
		}
	}
    return IPs
}

/* Generate comma seperated string of IPs from inputted array */
const generateString = IPs => {
    let retStr = ''
    for (const key in IPs) {
        retStr += IPs[key] + ','
    }
    return retStr.slice(0, -1)
}

app.listen(3000, () => console.log('Listening on port 3000!'))
