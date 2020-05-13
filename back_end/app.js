const bodyPaser = require('body-parser')
const express = require('express')
const path = require('path')
const multer = require('multer')

const app = express()

app.get('/api/vote', (req, res) =>{
   res.send('goodbye mate')
})

// middleware

module.exports = app