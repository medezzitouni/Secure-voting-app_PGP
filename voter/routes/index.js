const express = require('express')
const {adminCtrls} = require('../controllers')
const {isAutho} = require('../middlewares')
const router = express.Router()


router.post('/addVote', adminCtrls.addVote)

module.exports = router