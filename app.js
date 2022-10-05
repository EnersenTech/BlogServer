const http = require('http')
const express = require('express')
const {Server} = require('socket.io')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const app = express()
const apiHandler = require('./apis/index')


const port = 4000


const server = http.createServer(app)

io = new Server({
	maxHttpBufferSize: 1e7,
	pingTimeout: 60000,
	cors: {
	  origin: ['http://techenersen.com', 'http://www.techenersen.com', 'http://localhost:3000', 'http://127.0.0.1:3000'],
	  methods: ['GET', 'POST'],
	  allowedHeaders: ['my-custom-header'],
	  credentials: true,
	},
	ws: true
  }).listen(server)


app.use('/uploads', express.static(path.join(__dirname + '/src/img/')))
app.use('/', apiHandler)
app.set('io',io)
app.use(cors())


server.listen(port, () => {
	console.log('server is running')
})


io.sockets.on('connect', (socket) => {
	console.log('[' + socket.id + '] connection accepted')}
)	

