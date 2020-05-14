const mongoose = require('mongoose')
var cloudToken = 'mongodb+srv://info_security_project:147258@cluster0-hpwgx.mongodb.net/de_DB?retryWrites=true&w=majority'


var connect = function(){
  mongoose.connect(cloudToken, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  
        .then(() =>{
            console.log('DB connection succeeded')
        })
        .catch(err => {
              console.log('DB connection failed')
              console.error(err)
        })
}


module.exports = connect  



// const mysql = require('mysql')

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "med",
//     password: "nonnon123",
//     database:'FirstDB'
//   });
  
//   // connect to database
//   con.connect((err) => {
//     if (err)
//       throw err
//       console.log("DB Connected!");
      
//   });


   // ! create database
//  app.get('/createDB', (req, res) =>{
//     con.query("CREATE DATABASE FirstDB",(err, result) =>{
//       if (err) throw err
//           console.log(result)
  
//           res.send('Database created..')
//     });
//    })
     // ! create table
//   app.get('/createTable', (req, res) =>{
//     let sql = 'CREATE TABLE psots(id INT AUTO_INCREMENT, title VARCHAR(50), body VARCHAR(200), PRIMARY KEY(id) )'
  
//     con.query(sql, (err, result) =>{
//       if(err) throw err
  
//       res.send('table created')
//     })
//   })
   
//   app.get('/api/data', (req, res) =>{
//     let sql = 'SELECT * FROM psots'
//     con.query(sql, (err, result) =>{
//       if(err) throw err
//       console.log(typeof result)
//       res.json(result)
//     })
//   })
//    app.post('/api/data', (req, res) =>{
//         let data = {title :req.body.title, body :req.body.body }
//         console.log("ici " + req.body.title)
//         let sql = "INSERT INTO psots SET ?"
  
//         con.query(sql, data, (err, result) =>{
//              if(err) throw err
//              console.log(result)
//              res.json({msg: 'added: ' + result.message})
//         })
//    })