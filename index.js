const express = require('express');
const app = express();
const multer  = require('multer')
const path = require('path')
var cors = require('cors')
const upload = multer({ dest: './frontend/uploads/' })
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ExpressForm:ExpressForm@cluster0.ri0ry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
app.use(cors())

app.get('/form',function(req,res) {
    res.sendFile(path.join(__dirname,'/frontend/form.html'));
  });
app.post('/', upload.single('image'),(req,res)=>{
   const address = {
       street : req.body.street,
       city : req.body.city,
       zipCode : req.body.zipcode,
       state : req.body.state, 
       country : req.body.country
   }
   MongoClient.connect(url,function(err,db){
       if(err) throw err;
       var dbo = db.db('expressForm');
       var email = req.body.email;
       dbo.collection('users').find({"email" : email}).toArray((err,response)=>{
           if(response[0]){
               const message = {
                   msg : "email already exists"
               }
               res.send(message)
           }else{
            const message = {
                msg : "data inserted successfully"
            }
            res.send(message)
            dbo.collection('address').insertOne(address,function(err,result){
                if(err) throw err;
                const userData = {
                 firstName : req.body.firstname,
                 lastName : req.body.lastname,
                 email : req.body.email,
                 age : req.body.age,
                 gender : req.body.gender,
                 image : req.file.path,
                 addressId : result.insertedId 
             }
             dbo.collection('users').insertOne(userData,function(err,result){
                 if(err) throw err;
             })
            })
           }
       })
   })
})
app.get('/countries',(req,res)=>{
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db('expressForm')
        dbo.collection('countries').find({}).toArray(function(err,result){
            if(err) throw err;        
            res.send(result)
        })
    })
})

app.listen(3000, ()=>{
    console.log("server started @3000")
})




















