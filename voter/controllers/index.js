
const { VoterList} = require('../models')
// const axios = require('axios')
// const FormData = require('form-data');
// const fetch = require('node-fetch')


var addVote = async (req, res, next)  => {
      
      let {firstName, lastName, birthday} = req.body

      // ! get his ID form database using firstName and lastName 
      try {

          let data = await VoterList.findOne({ firstName : firstName, lastName: lastName, birthday: birthday })
          
         if(data) res.status(200).json({
                    voteNumber: data.voteNumber,
                    success: true
          })
          else res.json({
                success: false,
                message:" there are no employee has this informations, plz try again with a valid infos !"
          })
      } catch (err) {

        console.log("ur error " , err)

      }

        // fetch('http://127.0.0.1:3000/admin/addVote', {
        //     method: 'post',
        //     body:    JSON.stringify({voteNumber: voteNumber, bulletin : bulletin}),
        //     headers: { 'Content-Type': 'application/json' },
        // }).then(res => console.log(res.data.message))
        // .catch(err => console.log("voter to CO -> " + err));

        // sendDataToCo(voteNumber, bulletin)

                  
      
}







module.exports.adminCtrls = {
    
    addVote

}


