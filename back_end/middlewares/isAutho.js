const jwt = require('jsonwebtoken')


module.exports  = (req, res, next) =>{
    // console.log("mine " +req.headers.authorization)
    try{
       const token = req.headers.authorization.split(' ')[1]
        console.log('auth -> ' + token)
       const decodedToken = jwt.verify(token, 'RANDOM_STRING_SECRET')
       const adminId = decodedToken.adminId
       console.log("adminID -> " + adminId)
       console.log("body.adminID -> " + req.body.adminId)
       if(req.body.adminId && req.body.adminId !== adminId)
           throw new Error('Invalid admoinId')
       else
           next()
    }catch(err) 
       {  console.log('something does rong')
           res.json({
            error: err.stack
        })}
}