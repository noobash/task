// const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,'Please tell us your name!!!'],
        trim : true
    },
    email : {
        type : String,
        required : [true,'Please provide your email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail,'Please provide a valid email'],
    },
    // photo : {
    //     type : String,
    //     default : 'default.jpg'
    // },
    // role:{
    //     type:String,
    //     enum:['user','guide','lead-guide','admin'],
    //     default : 'user'
    // },
    password : {
        type : String,
        required : [true,'Enter a valid password'],
        minlength : [8,'Password should be atleast 8 character long'],
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true,'Enter a valid password'],
        validate : {
            // Only works on create or save.. 
            validator : function(el){
                return el === this.password;
            },
            message : "Passwords are not the same"

        }
    },
    // passwordChangedAt : Date,
    // passwordResetToken : String,
    // passwordResetExpires : Date,
    // active : {
    //     type : Boolean,
    //     default : true,
    //     select : false
    // }
});

userSchema.pre('save',async function(next){
    //Only run this function if password is modified.
    //if(!this.isModified('password')) return next();
    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);
    //Remove the passwordConfirm field.
    this.passwordConfirm = undefined;
    next();
})

// userSchema.pre('save',async function(next){
//     //Only run this function if password is modified.
//     if(!this.isModified('password')||this.isNew) 
//     return next();
//     //Hash the password with cost of 12
//     this.passwordChangedAt = Date.now() - 1000;
//     //Remove the passwordConfirm field.
//     next();
// })

// userSchema.pre(/^find/,function(next){
//     this.find({active:{$ne : false}});
//     next();
// })

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

// userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
//     if(this.passwordChangedAt){
//         const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
//        // console.log(changedTimestamp,JWTTimestamp);
//         return JWTTimestamp<changedTimestamp;
//     }
//     return false;
// }

// userSchema.methods.createPasswordResetToken = function(){
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
//     return resetToken;
// }

const User = mongoose.model('User',userSchema);

module.exports = User;  