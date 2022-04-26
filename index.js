const express = require('express');
const app = express();
const multer  = require('multer')
const path = require('path')
const upload = multer({ dest: './frontend/uploads/' })
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ExpressForm:ExpressForm@cluster0.ri0ry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// app.use(express.static('public'))
// app.get('/', (req, res)=>{
//     res.set({'Access-Control-Allow-Origin':'*'});
//     return res.redirect('form.html');
// })

app.get('/form',function(req,res) {
    res.sendFile(path.join(__dirname,'/frontend/form.html'));
  });
app.post('/signUp', upload.single('image'),(req,res)=>{
   const address = {
       street : req.body.street,
       city : req.body.city,
       zipCode : req.body.zipCode,
       state : req.body.state,
       country : req.body.country
   }
   MongoClient.connect(url,function(err,db){
       if(err) throw err;
       var dbo = db.db('expressForm');
       var email = req.body.email;
       dbo.collection('users').find({"email" : email}).toArray((err,response)=>{
           if(response[0]){
                return res.json({
                    status : 200,
                    message : "enter unique"
                })
           }else{
            dbo.collection('address').insertOne(address,function(err,result){
                if(err) throw err;
                const userData = {
                 name : req.body.name,
                 lastName : req.body.lastName,
                 email : req.body.email,
                 age : req.body.age,
                 gender : req.body.gender,
                 image : req.file.path,
                 addressId : result.insertedId 
             }
             dbo.collection('users').insertOne(userData,function(err,result){
                 if(err) throw err;
                 console.log(result)
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




















