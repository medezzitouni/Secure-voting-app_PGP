const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Admin, Vote, CountedVote} = require('../models')
const cipher = require('../cipher')



// ! create the keys
// cipher.generateKeyManager().then(_ => { console.log("KeyManager generated")})


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
var addVote = async (req, res, next)  => {
   
    let { voteNumber, bulletin } = req.body
        
    //  console.log('this from the voter', voteNumber, bulletin)

     let private_pgp_key    = cipher.config.key_private
     let server_passphrase = cipher.config.server_passphrase;
    // console.log(private_pgp_key)
 
     try {  

        voteNumber = await cipher.decrypt(private_pgp_key, server_passphrase, voteNumber)
        bulletin = await cipher.decrypt(private_pgp_key, server_passphrase, bulletin)
        // console.log('decrypted data -> ', voteNumber, bulletin)


       try {
            let vote_data = await Vote.findOne({ voteNumber })

            // let voter_data = await VoterList.findOne({voteNumber})
            if(vote_data) res.json({ // vote_data || voter_data.haveVoted
                done: false,
                msg : 'u have already voted'
            })
            else{
                let vote = new Vote({
                    voteNumber : voteNumber,
                    bulletin : bulletin
                })

                await vote.save()
              
                res.json({
                    done: true,
                    msg:'vote is saved successfuly, thank u for partipating'
                })

            }
       } catch (err) {     
    
            res.json({
                done: false,
                msg:'saving or updating data'
            })
            console.log(`prblm with saving or updating data ${err}`)
        }
       
     } catch (error) {
        res.json({
            done: false,
            msg: "data decryption"
            
        })

        console.log(`prblm with data decryption ${error}`)
     }
     

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

var addCountedVote = async (req, res, next)  => {


    let { voteNumber, bulletin, isCounted } = req.query
        
    //  console.log('this from the co', req.query.name)
    //     res.json({
    //         done: true,
    //         name : req.query.name
    //     })

     let private_pgp_key    = cipher.config.key_private
     let server_passphrase = cipher.config.server_passphrase;
    console.log("comming from CO", private_pgp_key)
 
     try {  

        voteNumber = await cipher.decrypt(private_pgp_key, server_passphrase, voteNumber)
        bulletin = await cipher.decrypt(private_pgp_key, server_passphrase, bulletin)
        console.log('decrypted data -> ', voteNumber, bulletin)

       try {
            let vote_data = await CountedVote.findOne({ voteNumber })

            // let voter_data = await VoterList.findOne({voteNumber})
            if(vote_data) res.json({ // vote_data || voter_data.haveVoted
                done: false,
                msg : 'u have already voted'
            })
            else{
                let countedVote = new CountedVote({
                            voteNumber : voteNumber,
                            bulletin : bulletin,
                            isCounted: isCounted
                        })
                await countedVote.save()
              
                res.json({
                    done: true,
                    msg:'vote is saved successfuly, thank u for partipating'
                })

            }
       } catch (err) {     
    
            res.json({
                done: false,
                msg:'saving or updating data'
            })
            console.log(`prblm with saving or updating data ${err}`)
        }
       
     } catch (error) {
        res.json({
            done: false,
            msg: "data decryption"
            
        })

        console.log(`prblm with data decryption ${error}`)
     }
     
}

var updateVote = async (req, res, next) =>{

    console.log('vote Id -> ', req.body.voteId)

    try {
        
       let vote = await Vote.findOne({_id: req.body.voteId})
       if(!vote)
              return res.json({
                  success : false,
                  error:'vote not found!'
              })
        let voteCounted = await CountedVote.findOne({ voteNumber:vote.voteNumber })

        if(voteCounted && voteCounted.isCounted){
            vote.isValid = true

            await Vote.updateOne({_id:vote._id}, vote)
            res.status(201).json({
                success: true,
                msg: "the vote is valid now"
            })
        }
        else res.json({
            success: false,
            error: 'The vote is not counted by the CO, thanks to try later'
        })
        
    } catch (error) {
        res.status(201).json({
            success: false,
            error : "update prblm : " + error
        })
    }

    // .then(vote =>{
    //     if(!vote)
    //        return res.status(401).json({
    //            error: new Error('Vote not found!'),
    //            msg:'vote not found!'
    //        })

    //        vote.isValid = true
    //        CountedVote.updateOne({_id:req.body.voteId},
    //         vote).then(() => res.status(201).json({
    //             valid: true
    //         }))
    //         .catch(err => res.status(400).json({
    //             error : err
    //         }))
    // })
    // .catch(err => res.status(500).json({
    //     error : 'findOneError: ' + err
    // }))
}


module.exports.adminCtrls = {
    login,
    signup,

    getVotes,
    addVote,
    updateVote,
    
    getCountedVotes,
    addCountedVote

}


