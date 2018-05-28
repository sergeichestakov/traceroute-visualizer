const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>
    res.sendFile('index.html')
)

app.post('/request', (req, res) => {
	const value = req.body.value
    console.log(value)
})

app.listen(3000, () => console.log('Listening on port 3000!'))
