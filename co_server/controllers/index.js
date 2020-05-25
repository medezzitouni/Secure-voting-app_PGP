const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Admin, VoterList, Vote} = require('../models')
const cipher = require('../cipher')
const axios = require('axios')
const kbpgp = require('kbpgp')
const FormData = require('form-data')

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
var addVote = async (req, res, next)  => {

    let { voteNumber, bulletin } = req.body
        
    //  console.log('this from the voter', voteNumber, bulletin)

     let private_pgp_key    = cipher.config.key_private
     let server_passphrase = cipher.config.server_passphrase;
    // console.log(private_pgp_key)

    
 
     try {
        voteNumber = await cipher.decrypt(private_pgp_key, server_passphrase, voteNumber)

       try {
            let vote_data = await Vote.findOne({ voteNumber })
            // let voter_data = await VoterList.findOne({voteNumber})
            if(vote_data) res.json({ // vote_data || voter_data.haveVoted
                success: false,
                error : 'u have already voted'
            })
            else{
                let vote = new Vote({
                    voteNumber : voteNumber,
                    bulletin : bulletin,
                    isCounted:true
                })

                await vote.save()
                
               let voter = await VoterList.findOne({ voteNumber })
               if(voter){
                    voter.haveVoted = true
                    await VoterList.updateOne({ _id: voter._id}, voter)
                }else{
                    console.log("there is no voter has that name")
                }
                bulletin = await cipher.decrypt(private_pgp_key, server_passphrase, bulletin)
                await sendVoteToDe(voteNumber, bulletin, true)

                res.status(201).json({
                        success: true,
                        message: 'vote is saved successfuly, thank u for partipating'
                        })

            }
       } catch (err) {     
    
            res.json({
                    success: true,
                    error : 'an error has generated, plz can u repeat later'
                })
            console.log(`prblm with saving or updating data ${err}`)
        }
       
     } catch (error) {
        res.json({
            success: true,
            error : 'an error has generated, plz can u repeat later'
        })

        console.log(`prblm with data decryption ${error}`)
     }
     
     
    //  console.log('MINE -> ', voteNumber)
     

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
                voted: true
            }))
            .catch(err => res.status(400).json({
                error : err
            }))
     
    })
    .catch(err => res.status(500).json({
        error : 'findOneError: ' + err
    }))
}


var getDEPublicKey = async function(path){
        let res = await axios.get(path)
        return res.data.k_public

}

var sendVoteToDe = async function(voteNumber, bulletin, isCounted){

    let de_pgp_key = await getDEPublicKey('http://127.0.0.1:3001/api/keymanager')
    console.log('from sendVoteToDe -> ', de_pgp_key)

    kbpgp.KeyManager.import_from_armored_pgp({
        armored: de_pgp_key
      }, function(err,server_km) {
        if (err) {
          console.log("co key is not loaded", err);
          return
        }
        let params = {
          msg: voteNumber,
          encrypt_for: server_km
      }

        kbpgp.box(params, function(err, result_string, result_buffer) {
          let encrypt_voteNumber = result_string

          kbpgp.KeyManager.import_from_armored_pgp({
            armored: de_pgp_key
          }, function(err,server_km) {
            if (err) {
              console.log("co key is not loaded2", err);
              return
            }
            let params = {
              msg:       bulletin,
              encrypt_for: server_km
          }
  
            kbpgp.box(params, async function(err, encrypt_bulletin, result_buffer) {
              // console.log('encrypted data', encrypt_voteNumber, encrypt_bulletin)
            //   let f = new FormData()
            //   f.append('voteNumber', encrypt_voteNumber)
            //   f.append('bulletin', encrypt_bulletin)
              try {
                  
                  let res = await axios.get('http://127.0.0.1:3001/admin/addCountedVote',{
                      params : {
                          voteNumber : encrypt_voteNumber,
                          bulletin: encrypt_bulletin,
                          isCounted: isCounted
                      }
                  }) 
                    console.log('result from DE', res.data.done, res.data.name)
              } catch (error) {
                  console.log('type error here -> ', error)
              }
  
            });
  
          });

        });

      });
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
