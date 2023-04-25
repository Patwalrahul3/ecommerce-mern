const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Please Enter your Name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should have more than 4 characters"],
       
    },
    email: {
        type:String,
        required:[true, "Please Enter your Email"],
        unique: true,
        validate:[validator.isEmail, "please enter a valid Emaiil"]  
    },
    password: {
        type:String,
        required:[true, "Please Enter your Password"],
        minLength:[4, "Name should be greater than 8 characters"],
        select: false    
    },
    avatar :{
         public_id : {
         type: String,
         required : true
        },
         url :{
         type: String,
         required : true
        },
    },
    role : {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

});

// hash the password when we create user
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
})

// JWT Token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

    // Generating password Reset Token
userSchema.methods.getResetPasswordToken= function(){

    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and added to usersSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 15 minute expire timer
    this.resetPasswordExpire = Date.now() +  15 * 60 * 1000;
    console.log(resetToken)
    return resetToken;
}




const User = mongoose.model("User", userSchema)
module.exports = User