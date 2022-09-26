const express = require('express')
const app = express()

app.get('/', (req,res) => {
	res.json({
		msg: "Hello Backend"
	})
})

app.listen(4000)
