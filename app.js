const http = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const app = express()
const apiHandler = require('./apis/index')


const port = 4000


const server = http.createServer(app)


app.use('/uploads', express.static(path.join(__dirname + '/src/img/')))
app.use('/', apiHandler)
app.use(cors(
	{
	origin: ['http://techenersen.com', 'http://www.techenersen.com', 'http://127.0.0.1:3000', 'https://techenersen.com', 'https://techenersen.com', 'http://localhost:3000'],
	methods: ['GET', 'POST'],
	allowedHeaders: ['my-custom-header'],
    credentials: true,
	}
))


server.listen(port, () => {
	console.log('server is running')
})
