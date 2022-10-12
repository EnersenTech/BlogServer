require("dotenv").config();
const http = require('http')
const https = require('https')
const express = require('express')
const {Server} = require('socket.io')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3=require('multer-s3')
const Pool = require('pg').Pool
const app = express()
// const apiHandler = require('./apis/index')

aws.config.update({
	screteAccessKey: process.env.ACCESS_SECRET,
	accessKeyId: process.env.ACCESS_KEY,
	region: process.env.REGION
})

const BUCKET=process.env.BUCKET
console.log(BUCKET)
console.log(aws.config.region)
const s3 = new aws.S3()

const upload = multer({
	storage:multerS3({
		bucket:BUCKET,
		s3: s3,
		acl: 'public-read',
		key: (req,file,cb)=>{
			cb(null, Date.now() + file.originalname)
		}
	})
})

const pool = new Pool({
	user: 'postgres',
	password: 'kwh47951712!',
	database: 'blog',
	host: "52.78.35.234",
	port: 5712
})

const port = 5000

const isHttps = process.env.IS_PRODUCTION
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
	host = 'https://' + 'api.techenersen.com' + ':' + port
	console.log(host)
  } else {
	server = http.createServer(app)
	host = 'http://' + 'api.techenersen.com' + ':' + port
	console.log(host)
  }


io = new Server({
	maxHttpBufferSize: 1e7,
	pingTimeout: 60000,
	cors: {
	  origin: ['https://techenersen.com', 'https://www.techenersen.com', 'http://localhost:3000', 'http://127.0.0.1:3000'],
	  methods: ['GET', 'POST'],
	  allowedHeaders: ['my-custom-header'],
	  credentials: true,
	},
	ws: true
  }).listen(server)

app.use(cors())
app.use('/uploads', express.static(path.join(__dirname + '/src/')))
// app.use('/', apiHandler)

app.set('io',io)

/* 
*
* APIs
*
*/

//============================== GET ==============================
app.get('/list', async(req,res)=>{
	let r = await s3.listObjectsV2({Bucket:BUCKET}).promise()
	let x = r.Contents.map(item => item.Key)
	res.send(x)
})

app.get('/download/:filename', async(req,res)=>{
	const filename = req.params.filename
	let x = await s3.getObject({Bucket: BUCKET, Key: filename}).promise()
	console.log(x)
	res.send(x.Body)
})

app.get('/a', (req,res)=>{
	res.send('path a')
})


//============================== POST ==============================
app.post('/upload', upload.single('file'),(req,res)=>{
	console.log(req.file)
	res.send('Successfully uploaded ' + req.file.location + ' location!')
})

app.post('/b', (req,res)=>{
	console.log(BUCKET)
	console.log(process.env.ACCESS_SECRET)
	console.log(process.env.ACCESS_KEY)
	console.log(process.env.REGION)
	res.send('test success')
})


app.post('/post', async(req,res)=>{
	try{
		const {ID, TITLE, CREATED_AT, CONTENT_ID, CATEGORY_ID} = req.body;
		const newPost = await pool.query(
			'INSERT INTO post (ID, TITLE, CREATED_AT, CONTENT_ID, CATEGORY_ID) VALUES ($1, $2, $3, $4, $5) RETURNING *',
		 [ID, TITLE, CREATED_AT, CONTENT_ID, CATEGORY_ID])

		 res.json(newPost)
		
	}catch(err){
		console.error(err.message)
	}

})

//============================== PUT ==============================

//============================== DELETE ==============================
app.delete('/delete/:filename', async(req,res)=>{
	const filename = req.params.filename
	await s3.deleteObject({Bucket: BUCKET, Key: filename}).promise()
	res.send('File Deleted Sucessfully!')
})


io.sockets.on('connect', (socket) => {
	console.log('[' + socket.id + '] connection accepted')}
)	

server.listen(port, () => {
	console.log('server is running')
})