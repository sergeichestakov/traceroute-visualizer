const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const traceroute = require('traceroute');
const request = require('request')

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.post('/request', (req, res) => {
    const value = req.body.value

	traceroute.trace(value, (err,hops) => {
		if (err) { //Send empty response and break
			res.json({})
			return
		}

        const IPs = extractIPs(hops)
        const requestJSON = generateJSON(IPs)

        request.post({ url:'http://ip-api.com/batch?fields=lat,lon', json: true, body: requestJSON }, (error, result, body) => {
            if(err) console.log(err)
           	res.json(body)
        })
	})
})

//Iterate through returned JSON and extract IP Addresses
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

//Generate a JSON of IPs from inputted Array
const generateJSON = IPs=> {
    let ret = []
    for (const key in IPs) {
        ret.push({
            query: IPs[key]
        })
    }
    return ret
}

app.listen(3000, () => console.log('Listening on port 3000!'))
