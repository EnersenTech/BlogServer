const http = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()


const port = 4000

const server = http.createServer(app)

app.get('/a', (req,res) => {
	res.send("Server")
})

server.listen(port, () => {
	console.log('server is running')
})
