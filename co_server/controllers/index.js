const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Admin, VoterList, Vote} = require('../models')

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

    console.log('getAllVotes')
    // let data = {}
    Vote.find().then((data) => 
    {
        //! here where we're gonna decrypt the vote, we'll decrypt just the ID
        res.status(200).json(data)
    })
    .catch(err => 
        res.status(400).json({
           error : err
        }))
    // res.status(200).json(data)
}

// ! save a vote come from the voter
var addVote = (req, res, next)  => {
    // const url = req.protocol + '://' + req.get('host')
    let { voteNumber, bulletin } = req.body
console.log('addVote here')
      // ! get his ID form database using firstName and lastName 
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


   // ? Voters list functions
var getVotersList = (req, res, next) => {
    console.log('getallVoters')
    // let data = {}
    VoterList.find().then((data) => 
    res.status(200).json(data))
    .catch(err => 
        res.status(400).json({
           error : err
        }))
    // res.status(200).json(data)
   }

var createVoter = (req, res, next)  => {
// const url = req.protocol + '://' + req.get('host')
let data = req.body,
    voter = new VoterList({
        firstName : data.firstName,
        lastName : data.lastName,
        birthday : data.birthday,
        // voteNumber : 8884,  // * u have to create a function that generate a unique vote number
        // haveVoted : Boolean(data.vote)
    })
    console.log("here it's the ID -> ", voter._id)
    voter.voteNumber = "voter" + voter._id
    voter.save()
    .then(() => res.status(201).json({
    message: 'voter is saved successfuly'
    }))
    .catch(err => res.status(400).json({
    error : `prblm with saving data ${err} `
}))
}
// ? set the haveVoted to true
var updateVoter = (req, res, next) =>{
    VoterList.findOne({_id: req.body.voterId})
    .then(voter =>{
        if(!voter)
           return res.status(401).json({
               error: new Error('Voter not found!'),
               msg:'voter not found!'
           })

           voter.haveVoted = true
           VoterList.updateOne({_id:req.body.voterId},
            voter).then(() => res.status(201).json({
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

    getVotersList,
    createVoter,
    updateVoter,

    getVotes,
    addVote,
    

}
