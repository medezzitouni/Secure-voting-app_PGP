const mongoose = require('mongoose')


const VoterSchema = mongoose.Schema({
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    voteNumber : {type: String, required: true},
    vote : {type: String, required: true}
})


module.exports = mongoose.model('Voter', VoterSchema)