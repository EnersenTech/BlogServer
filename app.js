const http = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()


const port = 4000

const server = http.createServer(app)

app.get('/', (req,res) => {
	return res.json({
		msg: "Hello Backend"
	})
})

server.listen(port, () => {
	console.log('server is running')
})
