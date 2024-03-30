require('dotenv').config()
const express=require('express');
const app=express()
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken");
const hbs=require('hbs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
const collection=require('./conn')
app.set("view engine","hbs");
app.set("views","../views")
app.use(express.json());
app.use(express.urlencoded({extended:true}))


// console.log(process.env.SECRET_KEY);
app.get('/',function(req,res){
    res.render("index.hbs")
})
app.get('/login',function(err,res){
    res.render("login");
})
app.get('/signup',function(req,res){
    res.render('signup');
})
 
app.post('/signup',async(req,res)=>{
    try {
        const password=req.body.password;
        const cpassword=req.body.cpassword;
        if (password===cpassword) {

           const Register=new collection({
            name:req.body.name,
            number:req.body.number,
            password:password,
            cpassword:cpassword

           })

        console.log("The Success Part" +Register);        
        // Token Part Start
        const token= await Register.generateAuthToken();
        console.log("The Token Part" + token);

        // Store Token In Client Website. Or Set Cookie in Client Computer .
        

        const registered=await Register.save();
        console.log("the page Part "+registered)
        // Token Part ends

          res.render("index");
        }
        else{
            res.send("Password Does not match")
        }
    } catch (error) {
        console.log("error is occured")
    }
})
app.post('/login',async(req,res)=>{
  

try {
    const name=req.body.name;
    const password=req.body.password;

   const username=await collection.findOne({name:name});

    // when match bycrpy password form database
    const isMatch= await bcrypt.compare(password,username.password)

    //this is token part
    const token= await username.generateAuthToken();
    console.log("The Token Part : " + token );

// token over

   if (isMatch) //(username.password===password) if bcrypt is not used we will paranthaces code use insted of isMatch
   {
        res.render("home");
   } else {
        res.send("Password Or Email Are Not Matching");
   }
    
} catch (error) {
    res.send("Invalid Name Or Password.")
}
})

// const createToken=async()=>{
//     const token=await jwt.sign({_id:"65d378185b2b2248570cbabb"},"hellothisisuniquetokenyesitisuniquetoken");
//     console.log(token);
//     const userver=await jwt.verify(token,"hellothisisuniquetokenyesitisuniquetoken");
//     console.log(userver);
// }

// createToken();
app.listen(7864,()=>{
    console.log("The Server is running");
})
