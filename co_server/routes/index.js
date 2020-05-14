const express = require('express')
const {adminCtrls} = require('../controllers') 
// const { get } = require('mongoose')
const {isAutho} = require('../middlewares')
const router = express.Router()



router
// ! login and signup of the admins 
.post('/login', adminCtrls.login)
.post('/signup', adminCtrls.signup)


// ! getAll and add a voter (employee) to the list
// ! set the haveVoted props to true, it means the voter have voted
.post('/createVoter', adminCtrls.createVoter) // ! create the user who can vote 
.get('/voters', isAutho, adminCtrls.getVotersList)
.put('/updateVoter', isAutho, adminCtrls.updateVoter)


// ! getVotes for admin and add vote that are comming from the voter ( Front-end)
.get('/votes', isAutho, adminCtrls.getVotes)
.post('/addVote', isAutho, adminCtrls.addVote)

module.exports = router