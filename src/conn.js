const mongoose = require('mongoose');
// const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')
mongoose.connect("mongodb://127.0.0.1:27017/practicelogin").then(()=>{
    console.log("Connection created Successfull")
}).catch((error)=>{
    console.log("Connection Created Not Successfull")
})
const loginSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    cpassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})

// JSW Token Start

loginSchema.methods.generateAuthToken = async function(req,res){
    try {
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()},"mynameishashshahandiamboy");
        this.tokens=this.tokens.concat({token:token})
        console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send("The Error Part" +error);
        console.log("The Error Part "+error);
    }
}

//Bcry  password
// loginSchema.pre("save", async function(next){
//     if(this.isModified("password")){
//     this.password =await bcrypt.hash(this.password,10);
//     this.cpassword=await bcrypt.hash(this.password,10);
// }
//     next();
// })

const loginmodel=new mongoose.model("loginsignup",loginSchema);
module.exports=loginmodel
