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
.post('/addVote', adminCtrls.addVote)
.put('/updateVote', isAutho, adminCtrls.updateVote) // ! set the isValid value to true, it means the vote is valid


.get('/countedVotes', isAutho, adminCtrls.getCountedVotes)
.get('/addCountedVote', adminCtrls.addCountedVote)

module.exports = router