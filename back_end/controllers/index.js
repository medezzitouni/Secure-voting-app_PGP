const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Admin} = require('../models/')

var login = (req, res, next) =>{
    Admin.findOne({username: req.body.username})
    .then(admin =>{
        if(!admin)
           return res.status(401).json({
               error: new Error('Admin not found!'),
               msg:'Admin not found!'
           })
        bcrypt.compare(req.body.password, admin.password)
        .then(valid =>{
            if(!valid)
               return res.status(401).json({
                   error: new Error('password Incorrect!'),
                   msg:'password Incorrect!'
               })
               // !sinon
               let token = jwt.sign(
                   { adminId : admin._id},
                   'RANDOM_STRING_SECRET',
                   {expiresIn : '24h'}

               )
            // req.headers.authorization = [admin._id, token]
            res.status(201).json({
                id: admin._id,
                token
            })

            // res.redirect('/admin/voters')
        })
        .catch(err => res.status(500).json({
            error : 'compareError: ' + err
        }))
    })
    .catch(err => res.status(500).json({
        error : 'findOneError: ' + err
    }))
}


var signup = (req, res, next) =>{
    
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        let admin = new Admin({
            username: req.body.username,
            password: hash,
            adminType: "co"
        })
         console.log("this is the password ->" + req.body.password)
        admin.save()
        .then(() => res.status(201).json({
            msg: 'user added successfuly!'
        }))
        .catch(err => res.status(500)
        .json({
            error : 'saveError :' + err
        }))
    }).catch(err => res.status(500).json({
        error: 'hashError: ' + err
    }))
}

var getVotes = (req, res) => {
    res.json({1 : "cd1", 2 : "cd2"})
}
var getAllVoters = (req, res, next) =>{
    console.log('getallVoters')
    let data = {}
    // Voter.find().then((data) => 
    // res.status(200).json(data))
    // .catch(err => 
    //     res.status(400).json({
    //        error : err
    //     }))
    res.status(200).json(data)
   }
module.exports.adminCtrls = {
    login,
    signup,
    getVotes,
    getAllVoters
}


