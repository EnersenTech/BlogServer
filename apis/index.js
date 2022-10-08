const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const markDownParser = require( './helpers/markDownParser.js')

const mockup_data = require('./project_mockup.js')


router.get('/', (req,res) => {
	res.json({msg: 'Server from port 4000 root'})
})

router.get('/a', (req,res) => {
	res.json({msg: 'Server from port 4000 /a path'})
})

router.get('/project/:contentId', (req,res,next)=>{
	const {contentId} = req.params

	const requested_content = mockup_data.filter(el => {return el.id == contentId})
	const requested_text = markDownParser(requested_content[0].md_file)
	res.status(200).json({
		data : requested_content,
		text: requested_text
		})
})


module.exports = router

