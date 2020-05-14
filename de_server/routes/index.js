const express = require('express')
const {adminCtrls} = require('../controllers') 
const {isAutho} = require('../middlewares')
const router = express.Router()



router
// ! login and signup of the admins 
.post('/login', adminCtrls.login)
.post('/signup', adminCtrls.signup)


// ! getVotes for admin and add vote that are comming from the voter ( Front-end)
.get('/votes', isAutho, adminCtrls.getVotes)
.post('/addVote', isAutho, adminCtrls.addVote)


.get('/countedVotes', isAutho, adminCtrls.getCountedVotes)
.post('/addCountedVote', isAutho,adminCtrls.addCountedVote)
.put('/updateCountedVote', isAutho, adminCtrls.updateCountedVote) // ! set the isValid value to true, it means the vote is valid

module.exports = router