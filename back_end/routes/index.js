const express = require('express')
const {adminCtrls} = require('../controllers') 
// const { get } = require('mongoose')
const {isAutho} = require('../middlewares')
const router = express.Router()

router.post('/login', adminCtrls.login)
.post('/voters', isAutho, adminCtrls.getAllVoters)
.get('/votes', adminCtrls.getVotes)
.post('/signup', adminCtrls.signup)

module.exports = router