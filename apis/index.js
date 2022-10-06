const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()


router.get('/', (req,res) => {
	res.json({msg: 'Server from port 4000 root'})
})

router.get('/a', (req,res) => {
	res.json({msg: 'Server from port 4000 /a path'})
})

router.get('/project/:contentId', (req,res,next)=>{
	res.json({
		
	})
})


module.exports = router

