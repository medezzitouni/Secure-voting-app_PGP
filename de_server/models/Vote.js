const mongoose = require('mongoose')


const VoterSchema = mongoose.Schema({
    voteNumber : {type: String, required: true},
    bulletin : {type: String, required: true},
    isCounted : {type: Boolean, required: true, default: true}
})


module.exports = mongoose.model('Vote', VoterSchema)