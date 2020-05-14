const mongoose = require('mongoose')


const VoterSchema = mongoose.Schema({
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    birthday : {type: String, required: true},
    voteNumber : {type: String, required: true},
    haveVoted : {type: Boolean, default: false}
})


module.exports = mongoose.model('VoterList', VoterSchema)