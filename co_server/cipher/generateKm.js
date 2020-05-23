
const kbpgp = require('kbpgp')

const generateKeyManager = function (){
   return new Promise((resolve, reject )=>{
          

          kbpgp.KeyManager.generate_rsa({ userid : "Bo Jackson <ezzmed3@example.com>" }, function(err, charlie) {
            if(err) reject(err)
            else{
                charlie.sign({},function(err) {
                    if(err) reject(err)
                    else{
                           //* display the keyManager
                  // console.log("done! ", charlie);
                  
      
                charlie.export_pgp_private ({
                  passphrase: 'booyeah!'
                }, function(err, pgp_private) {
                    //* dispay the private key
      
                  // console.log("private key: ", pgp_private);
                });
      
                charlie.export_pgp_public({}, function(err, pgp_public) {
                    //* display the public key
      
                  // console.log("public key: ", pgp_public);
                });
                    }
                    console.log("done! ", charlie);
                  resolve(charlie)
                });
            }
         });
   })
    

    
}


module.exports = generateKeyManager