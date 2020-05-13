const bodyPaser = require('body-parser')
const express = require('express')
const path = require('path')
const multer = require('multer')

const app = express()

app.use(bodyPaser.json())
app.get('/api/vote', (req, res) =>{
   res.send(req.body.title)
})

// middleware

module.exports = app