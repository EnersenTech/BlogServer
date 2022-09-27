const http = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()


const port = 4000

const server = http.createServer(app)

app.get('/', (req,res) => {
	res.json({msg: 'Server from port 4000 root'})
})

app.get('/a', (req,res) => {
	res.json({msg: 'Server from port 4000 /a path'})
})

server.listen(port, () => {
	console.log('server is running')
})
