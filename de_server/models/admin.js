const mongoose = require('mongoose')
const mgUniqueVlidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username : {type: String, required: true, unique: true},
    password : {type: String, required: true},
})

userSchema.plugin(mgUniqueVlidator)


module.exports = mongoose.model('Admin', userSchema)