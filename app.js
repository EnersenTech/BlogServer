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
const bodyParser = require('body-parser');
const app = express()
var jsonParser = bodyParser.json()
const { sequelize } = require('./models')
const Models = require('./models')


const BUCKET=process.env.BUCKET
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


sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database connected')
  })


const port = 5000

const isHttps = process.env.NODE_ENV == 'development' ? false : true
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
app.use('/', jsonParser)


app.set('io',io)

/* 
*
* APIs
*
*/

//============================== GET ==============================

// S3 파일 리스트 전체 조회
app.get('/list', async(req,res)=>{
	let r = await s3.listObjectsV2({Bucket:BUCKET}).promise()
	let x = r.Contents.map(item => item.Key)
	res.send(x)
})

// S3 파일 조회 
app.get('/file/:fileId', async(req,res)=>{
	const {fileId} = req.params
	console.log(fileId)
	const params = {Bucket: BUCKET, Key: fileId}
	// await s3.getObject(params, (err, data) => {
	// 	console.log(data)
	// 	res.writeHead(200, {'Content-Type': 'image/jpeg'});
	// 	res.write(data.Body, 'binary');
	// 	res.end(null, 'binary');
	// })
	let r = await s3.getObject(params).promise()
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		res.write(r.Body, 'binary');
		res.end(null, 'binary');
})

// S3 파일 다운로드
app.get('/download/:filename', async(req,res)=>{
	const filename = req.params.filename
	let x = await s3.getObject({Bucket: BUCKET, Key: filename}).promise()
	res.send(x.Body)
})

// 포스트 카테고리 리스트 전체 조회
app.get('/post/category_list', async(req,res)=>{
	const category_list = await Models.CATEGORY.findAll({
		attributes: ['ID', 'NAME']
	})
	
	res.status(200).json(category_list)
})

// 포스트 서브 카테고리 리스트 조회 
app.get('/post/sub_category_list/:id', async(req,res)=>{
	const {id} = req.params
	const sub_category_list = await Models.SUB_CATEGORY.findAll({
		where: {CATEGORY_ID : id},
		attributes: ['ID', 'NAME']
	})
	
	res.status(200).json(sub_category_list)
})


// 포스트 전체 리스트 조회
app.get('/post/all', async(req,res)=>{
	const post_list = await Models.POST.findAll({
		attributes: ['ID', 'TITLE', 'THUMBNAIL', 'CATEGORY_ID', 'AUTHOR', 'TAG', 'CONTENT_TEXT', 'SUB_CATEGORY_ID', 'createdAt'],
		raw: true
	})


	let list = await Promise.all(post_list.map(async(el,idx) => {
		const {ID, TITLE, THUMBNAIL, CATEGORY_ID, AUTHOR, TAG, CONTENT_TEXT, SUB_CATEGORY_ID, createdAt} = el

		const category_name =  await Models.CATEGORY.findOne({
			where: {ID: CATEGORY_ID},
			attributes: ['NAME'],
			raw: true
		})
	
		const sub_category_name = await Models.SUB_CATEGORY.findOne({
			where: {ID: SUB_CATEGORY_ID},
			attributes: ['NAME'],
			raw: true
		})

		
		return 	{
			ID: ID,
			TITLE: TITLE,
			THUMBNAIL: THUMBNAIL,
			CATEGORY_NAME: category_name.NAME,
			AUTHOR: AUTHOR, 
			TAG: TAG,
			CONTENT_TEXT: CONTENT_TEXT, 
			SUB_CATEGORY_NAME: sub_category_name.NAME, 
			createdAt: createdAt
			}

	}))
	res.status(200).json(list)

})

// 포스트 단일 리스트 조회
app.get('/post/:postId', async(req,res)=>{
	const {postId}= req.params
	const post_list = await Models.POST.findOne({
		where: {ID: postId},
		attributes: ['ID', 'TITLE', 'THUMBNAIL', 'CATEGORY_ID', 'AUTHOR', 'TAG', 'CONTENT_TEXT', 'SUB_CATEGORY_ID', 'createdAt'],
		raw: true
	})

		const {ID, TITLE, THUMBNAIL, CATEGORY_ID, AUTHOR, TAG, CONTENT_TEXT, SUB_CATEGORY_ID, createdAt} = post_list

		const category_name =  await Models.CATEGORY.findOne({
			where: {ID: CATEGORY_ID},
			attributes: ['NAME'],
			raw: true
		})
	
		const sub_category_name =  await Models.SUB_CATEGORY.findOne({
			where: {ID: SUB_CATEGORY_ID},
			attributes: ['NAME'],
			raw: true
		})


		
		return res.status(200).json(
			{
			ID: ID,
			TITLE: TITLE,
			THUMBNAIL: THUMBNAIL,
			CATEGORY_NAME: category_name.NAME,
			AUTHOR: AUTHOR, 
			TAG: TAG,
			CONTENT_TEXT: CONTENT_TEXT, 
			SUB_CATEGORY_NAME: sub_category_name.NAME, 
			createdAt: createdAt
			}
		)

	})



//============================== POST ==============================

// S3 이미지, 비디오 파일 업로드 
app.post('/upload', upload.single('file'),(req,res)=>{
	console.log(req.file)
	res.send('Successfully uploaded ' + req.file.location + ' location!')
})


// 포스트 업로드
app.post('/post', async(req,res)=>{
	try{
	
	const {title, author, thumbnail, tag, content_text, category_id, sub_category_id} = req.body
	const sequelizeTransaction = await sequelize.transaction()

	// CREATE POST 
	await Models.POST.create({
		TITLE : title, 
		AUTHOR: author, 
		TAG: tag, 
		THUMBNAIL: thumbnail,
		CONTENT_TEXT: content_text,
		SUB_CATEGORY_ID : sub_category_id,
		CATEGORY_ID : category_id
	}, { transaction: sequelizeTransaction })
		

	res.status(200).json('Successfully uploaded post')
	sequelizeTransaction.commit()
		
	}catch(err){
		console.error(err.message)
	}

})

// 카테고리 업로드
app.post('/category', async(req,res)=>{
	try{
	const sequelizeTransaction = await sequelize.transaction()

	const {name} = req.body

	await Models.CATEGORY.create({
		NAME: name
	},{ transaction: sequelizeTransaction })
	sequelizeTransaction.commit()

	res.status(201).json('Successfully created category')

	}catch(err){
		console.error(err)
	}
})

// 서브 카테고리 업로드
app.post('/sub_category', async(req,res)=>{
	try{
	const sequelizeTransaction = await sequelize.transaction()

	const {name, category_id} = req.body

	await Models.SUB_CATEGORY.create({
		NAME: name,
		CATEGORY_ID: category_id
	},{ transaction: sequelizeTransaction })
	sequelizeTransaction.commit()

	res.status(201).json('Successfully created sub_category')

	}catch(err){
		console.error(err)
	}
})

//============================== PUT ==============================

//============================== DELETE ==============================

// S3 파일 삭제 
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