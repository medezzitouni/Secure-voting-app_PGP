const bodyPaser = require('body-parser')
const express = require('express')
const path = require('path')
const multer = require('multer')
const connect = require('./db/connection')
const router = require('./routes')
const cipher = require('./cipher')

const app = express()


// to make the frontend and backend have the same origin (domin, server, etc)
//  This will allow all requests from all origins to access your API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

 connect()



app.use('/admin',express.static(path.join(__dirname, 'public/admins')))
.use(multer().none()) 
.use('/admin/', router)
//! give public key 
.get('/api/keymanager', (req, res) =>{
  res.json({
      k_public: cipher.config.key_public,
      msg:'this is the key public'
  })

})



module.exports = app