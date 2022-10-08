require("dotenv").config();
const http = require('http')
const https = require('https')
const express = require('express')
const {Server} = require('socket.io')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const app = express()
const apiHandler = require('./apis/index')


const port = 5000
const isHttps = process.env.isProduction == undefined ?  true : false
let io, server, host


if (isHttps) {
	const fs = require('fs')
	const options = {
	  key: fs.readFileSync(
		path.join(__dirname, './ssl/private.key'),
		'utf-8',
	  ),
	  cert: fs.readFileSync(
		path.join(__dirname, './ssl/techenersen.pem'),
		'utf-8',
	  )
	}
	server = https.createServer(options, app)
	host = 'https://' + 'techenersen.com' + ':' + port
	console.log(host)
  } else {
	server = http.createServer(app)
	host = 'http://' + 'techenersen.com' + ':' + port
	console.log(host)
  }


io = new Server({
	maxHttpBufferSize: 1e7,
	pingTimeout: 60000,
	cors: {
	  origin: ['https://techenersen.com/', 'https://www.techenersen.com/', 'http://localhost:3000/', 'http://127.0.0.1:3000/'],
	  methods: ['GET', 'POST'],
	  allowedHeaders: ['my-custom-header'],
	  credentials: true,
	},
	ws: true
  }).listen(server)


app.use('/uploads', express.static(path.join(__dirname + '/src/img/')))
app.use('/', apiHandler)
app.use(cors())

app.set('io',io)


io.sockets.on('connect', (socket) => {
	console.log('[' + socket.id + '] connection accepted')}
)	

server.listen(port, () => {
	console.log('server is running')
})