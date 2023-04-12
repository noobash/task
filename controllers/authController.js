const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAssync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
const crypto = require('crypto');

const createSendToken = (user,statusCode , res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24),
        httpOnly : true
    };
    if (process.env.NODE_ENV==='production')
    cookieOptions.secure = true;
    else (process.env.NODE_ENV==='development')
    cookieOptions.secure = false;
    res.cookie('jwt',token,cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status : 'Success',
        token : token,
        data : {
            user,
        }
    })
} 

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.signup = catchAssync(async (req,res,next)=>{
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });
    // const url = `${req.protocol}://${req.get('host')}/me`;
    // await new Email(newUser,url).sendWelcome();
    createSendToken(newUser,201,res);
});

exports.login = catchAssync(async (req,res,next)=>{
    const {email,password} = req.body;
    //Check if email and password exists..
    if(!email||!password){
        return next(new AppError('Please provide email and password!',400));
    }
    //Check if user exists && password is correct.
    const user = await User.findOne({email}).select('+password');
    //If everything ok send token to client.
    if(!user||!(await user.correctPassword(password,user.password))){
        return next(new AppError('Please provide valid credentials!',401));
    }
    createSendToken(user,200,res);
});

exports.protect = catchAssync(async (req,res,next) =>{
    // Get Token and chechk if its exist\
    let token;
    //console.log(req.headers);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.',401));
    }
    // Verification token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //If user still exists
    const user = await User.findById(decoded.id);
    if(!user){
        return next(new AppError('User belonging to this token no longer exist',401))
    }
    //If user changed password after the token was issued
    // if(user.changedPasswordAfter(decoded.iat)){
    //     return next(new AppError('Password Changed After generation of token. Please Log in again',401));
    // }
    //Grant access to protected route
    req.user = user;
    next();
})

// exports.restrictTo = (...roles) => {
//     return (req,res,next) => {
//         // roles ['admin','lead-guide']
//         if(!roles.includes(req.user.role)){
//             return next(new AppError('You do not have permission to perform this action',403));
//         }
//         next();
//     }
// }

// exports.forgotPassword = catchAssync(async(req,res,next) => {
//     // Get user based on posted email
//     const user = await User.findOne({email : req.body.email});
//     if(!user){
//         return next(new AppError('There is no user with the given email address.',404));
//     }
//     // Generate the random reset token
//     const resetToken = user.createPasswordResetToken();
//     await user.save({validateBeforeSave : false});
    
//     // Send it to user's mail
//     try{
//         const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
//         await new Email(user,resetURL).sendPasswordReset();
//         res.status(200).json({
//             status : 'success',
//             message : 'Token Sent to email!'
//         })
//     }
//     catch(err){
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires =undefined;
//         await user.save({validateBeforeSave : false});
//         return next(new AppError('There was an error sending the email. Try again later!',500));
//     }
// })

// exports.resetPassword = catchAssync(async(req,res,next) => {
//     // Get user based on token
//     let hashedtoken = req.params.token;
//     hashedtoken = crypto.createHash('sha256').update(hashedtoken).digest('hex');
//     const user = await User.findOne({passwordResetToken : hashedtoken,passwordResetExpires : {$gt : Date.now()}});
//     if(!user){
//         return next(new AppError('Token is invalid or expired!',400));
//     }
//     // If there is a user and token not expired then set the new password.
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires =undefined;
//     // Update changedPasswordAt property for the user.
//     await user.save({validateBeforeSave : true}); 
//     // Log the user in and send JWT
//     createSendToken(user,200,res);
// })

// exports.updatePassword = catchAssync(async (req,res,next) => {
//     // Get user
//     const user = await User.findById(req.user.id).select('+password');
    
//     // Check if posted current password is correct
//     const currentPassword = req.body.currentPassword;
//     if(!(await user.correctPassword(currentPassword,user.password))){
//         return next(new AppError('Your Current Password is incorrect!',401));
//     }
//     // If so update password
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     await user.save();
//     // Log user in, send JWT 
//     createSendToken(user,200,res);
// })