const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Admin, Vote, CountedVote} = require('../models')

// ? admins login
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

//? add an admin
var signup = (req, res, next) =>{
    
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        let admin = new Admin({
            username: req.body.username,
            password: hash,
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



var getVotes = (req, res, next) => {

    let adminId = req.headers.adminid
    console.log('getAllVotes')
    // let data = {}
    Vote.find().then((data) => 
    {
        //! here where we're gonna decrypt the vote.then we'ill decrypt the ID and the B 
        res.status(200).json(data)
    })
    .catch(err => 
        res.status(400).json({
           error : err
        }))
    // res.status(200).json(data)
}

// ! this is gonna serve the front-end
var addVote = (req, res, next)  => {
    // const url = req.protocol + '://' + req.get('host')
    let { voteNumber, bulletin } = req.body

      // ! create and stock the encrypted vote come from the voter to the de and co  
     // ! stock in the Vote.js
        let vote = new Vote({
            voteNumber : voteNumber,
            bulletin : bulletin
        })

     vote.save()
     .then(() => res.status(201).json({
     message: 'vote is saved successfuly'
     }))
     .catch(err => res.status(400).json({
        error : `prblm with saving data ${err} `
    }))

}


var getCountedVotes = (req, res, next) => {

    console.log('getCountedVotes')
    // let data = {}
    CountedVote.find().then((data) => 
    {
        // ! decrypt the Counted votes, be careful they are double encryped
        res.status(200).json(data)
    })
    .catch(err => 
        res.status(400).json({
           error : err
        }))
    // res.status(200).json(data)
}

var addCountedVote = (req, res, next)  => {

        let { voteNumber, bulletin } = req.body

        // ! create and stock the encrypted vote come from the CO   
         // ! stock in the CountedVote.js
        let countedVote = new CountedVote({
            voteNumber : voteNumber,
            bulletin : bulletin
        })

    countedVote.save()
    .then(() => res.status(201).json({
    message: 'vote is saved successfuly'
    }))
    .catch(err => res.status(400).json({
        error : `prblm with saving data ${err}`
    }))
}

var updateCountedVote = (req, res, next) =>{
    CountedVote.findOne({_id: req.body.voteId})
    .then(vote =>{
        if(!vote)
           return res.status(401).json({
               error: new Error('Vote not found!'),
               msg:'vote not found!'
           })

           vote.isValid = true
           CountedVote.updateOne({_id:req.body.voteId},
            vote).then(() => res.status(201).json({
                message: 'raaak nadddi'
            }))
            .catch(err => res.status(400).json({
                error : err
            }))
    })
    .catch(err => res.status(500).json({
        error : 'findOneError: ' + err
    }))
}


module.exports.adminCtrls = {
    login,
    signup,

    getVotes,
    addVote,
    
    getCountedVotes,
    addCountedVote,
    updateCountedVote

}


