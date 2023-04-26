const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('./../middleware/catchAsyncErrors')
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js')
const crypto = require('crypto')


/***
 * 
 * 
 *   Register USER 
 * 
 */

exports.registerUser = catchAsyncErrors(async(req, res, next) => {

    const {name, email ,password} = req.body;

    const user = await User.create({
        name, 
        email,
        password,
        avatar:{
            public_id: "this is sample id",
            url : "profilepicUrl"
        }
    })

    sendToken(user, 201 , res);

})


/***
 * 
 * 
 *   LOGIN USER 
 * 
 */

exports.loginUser = catchAsyncErrors(async(req, res, next) =>{

    const {email , password} = req.body;

    console.log(email, password , "emal and password")

    // checking if user has given password and email both 

    if(!email || !password){
        return next(new ErrorHandler("please enter email & Password", 400));
    }

   const user = await User.findOne({email}).select("+password");
  
   if(!user){
    return next(new ErrorHandler("Invalid email or password", 401));

   }

   const isPasswordMatch = await user.comparePassword(password);
  
   if(!isPasswordMatch){
    return next(new ErrorHandler("Invalid email or password", 401));
   }

    sendToken(user, 200 , res);

})


/***
 * 
 *   LOGOUT FUNCTIONALITY
 * 
 */

exports.logoutUser = catchAsyncErrors(async(req, res, next) => {

    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly: true
    })


    res.status(200).json({
        success: true,
        message: 'logged out successfully !'
    })

})


/***
 * 
 *   Forgot Password FUNCTIONALITY
 * 
 */

exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
 
    const user = await User.findOne({email: req.body.email});
 
    if(!user){
        return next(new ErrorHandler("user not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`


    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it. `;

    try{

        await sendEmail({
         email : user.email,
         subject:'Ecommerce Password Recovery',
         message
        })

        res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
        })


    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordToken = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }

})


/***
 * 
 *   Reset Password FUNCTIONALITY
 * 
 */

exports.resetPassword = catchAsyncErrors(async(req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }

   if(req.body.password !== req.password.confirmPassword){
    return next(new ErrorHandler("Password doesnot match", 400));
   }

   await user.save();

   sendToken(user, 200, res);

})


/***
 * 
 *   Get user detail --> only login user
 * 
 */

exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    
   const user = await User.findById(req.user.id);

   res.status(200).json({
    success: true, 
    user
   })
})


/***
 * 
 *  update password inside profile
 * 
 */

exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    
    const user = await User.findById(req.user.id).select("+password");
   
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect", 400));
    }
    
   if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password doesnot match", 400));
   }

   user.password = req.body.newPassword;

   await user.save();

   sendToken(user, 200, res);

 })


 /***
 * 
 *  update User profile
 * 
 */

exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
 
const newUserData = { 
    name: req.body.name,
    email: req.body.email
}

await User.findByIdAndUpdate(req.user.id, newUserData,{
    new: true,
    newValidators: true,
    useFindAndModify: false
})

res.status(200).json({
    success: true,
})
 
})



 /***
 * 
 *  Get all users (admin)
 * 
 */

 exports.getAllUser = catchAsyncErrors(async(req, res, next) => { 
 
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

 })
 

  /***
 * 
 *  Get single users (admin)
 * 
 */

  exports.getSingleUser = catchAsyncErrors(async(req, res, next) => { 
 
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })

 })

  /***
 * 
 *  update user role or anything (admin)
 * 
 */


  exports.updateUser = catchAsyncErrors(async(req, res, next) => {
 
    const newUserData = { 
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    
    await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        newValidators: true,
        useFindAndModify: false
    })
    
    res.status(200).json({
        success: true,
    })
     
    })


    /***
 * 
 *  delete user  or anything (admin)
 * 
 */


  exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
 
 
   const user = await User.findByIdAndDelete(req.params.id);
 
   if(!user){
    return next(new ErrorHandler(`user does not exist with id :${req.params.id}`))
   }

    res.status(200).json({
        success: true,
        message: "user deleted successfully!"
    })
     
    })