const mongoose=require('mongoose');

const UserSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
         type:String,
    },
    posts:{
        type:[
            {
                type : mongoose.Schema.Types.ObjectId,
                 ref:'Post'
            }
        ],
    },
    courses:{
        type:[
            {
                type : mongoose.Schema.Types.ObjectId,
                 ref:'Course'
            }
        ],
    },
    bio:{
         type:String,
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiresAt: {
        type: Date,
        default: null //pending
    },
    cart:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Cart",
    }
    ],
});

module.exports=mongoose.model('User',UserSchema);