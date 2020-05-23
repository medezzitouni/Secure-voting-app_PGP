const kbpgp = require('kbpgp')



var decrypt = function(server_pgp_key, server_passphrase, data){
    return new Promise((resolve, reject) =>{
             
    kbpgp.KeyManager.import_from_armored_pgp({
        armored: server_pgp_key
      }, function(err, km) {
        if (!err) {
          if (km.is_pgp_locked()) {
            km.unlock_pgp({
              passphrase: server_passphrase
            }, function(err) {
              if (err) console.log("Loaded private key with passphrase err -> ", err);
  
              
              kbpgp.unbox({keyfetch: km, armored: data}, function(err, literals) {
                  if (err != null) {
                    reject(err)
                  } else {
                    console.log("decrypted message");
                    console.log("[0] -> " , literals[0].toString());
                    resolve(literals[0].toString())

                    //! the following is for signer if there is a signer
                  //   let ds = km = null;
                  //   ds = literals[0].get_data_signer();
                  //   if (ds) { km = ds.get_key_manager(); }
                  //   if (km) {
                  //     console.log("Signed by PGP fingerprint");
                  //     console.log(km.get_pgp_fingerprint().toString('hex'));
                  //   }
                  }
                });
  
  
  
            });
          } else {
            console.log("Loaded private key w/o passphrase");
            reject(new Error("Loaded private key w/o passphrase"))
          }
        }
      });
    })
  
}


module.exports =  decrypt