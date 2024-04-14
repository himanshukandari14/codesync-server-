
const User=require('../models/User');
const sendEmail=require('../utils/nodemailer');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const { generateToken } = require('../middleware/Auth');
const otpGenerator=require('otp-generator');
const { send } = require('process');

// register controller
exports.register = async(req,res)=>{

    try {
        // fetch data
    const {firstName,lastName,username,email,password}=req.body;


    // validation

    if(!(firstName || lastName || username || email || password)){
        return res.status(400).json({
            success:false,
            message: "Please provide all the details"
        });
    }

    // check if user exists or not with this email
   const userExists=await User.findOne({email});

   if(userExists){
    return res.status(409).json({
        success: false,
        message:'user already exists'
    })
   }

    //    hash password
    
   const hashedPassword = await bcrypt.hash(password,10);
    // create entry in db
    const user= await User.create({
        username,
        firstName,
        lastName,
        username,
        email,
        password:hashedPassword,
        image: 'https://api.dicebear.com/8.x/lorelei/svg' // Default image URL

    });
     // Send an email to the user
        const subject = 'Registration Successful on CodeSync';
        const text = `Hello ${firstName},\n\nThank you for registering on our website. Your account has been successfully created.`;
        sendEmail(email, subject, text);
    console.log('New user created =>',user);

    // send response
    return res.status(200).json({
            success:true,
            message: 'user created successfully',
            data:user
        });


    
    } catch (error) {
        console.log(error)
         return res.status(500).json({
            success:false,
            message:error,
        })
    }
    

}

// login controller
exports.login=async(req,res)=>{
    const{username,password}=req.body;
    try {
        // check if user exits or not
        const user=await User.findOne({username});
        if(!user){
            return res.json({
                success: false,
                message:'User doesnot exists'
            })
        }

        // if user does exists so  we will compare the password
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(403).json({
                success: false,
                message:'username or password is invalid'
            })
        }

        // make payload
        const payload={
            id:user.id,
            username:user.username,
        };

        console.log('payload is =>',payload);
        const token = generateToken(payload);

        // retrun res

        return res.json({
            token,
            user,
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
        error:error.message,
    })
    }
}

// authController.js

exports.logout = async (req, res) => {
    try {
       

        // Alternatively, if using cookies, clear the token cookie
        res.clearCookie('token');

    

        // Send a response indicating successful logout
        return res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// // password reset
exports.resetPassword = async (req, res) => {
    try {
        const userdata = req.user; //it contains only username and id of logged in user
        
        const userId = req.user.id;

        const user=await User.findById(userId);
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input fields
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
        }

        // Validate current password by comparing it with the hashed password stored in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// get user

exports.getUser = async(req,res)=>{
    const userId=req.user.id;
    console.log(userId);
    try {
         const user=await User.findById(userId);

    return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'cannot get user'
        })
    }

   
}
// delete user
exports.deleteUser = async(req,res) =>{
    const userData= req.user;
    const userId=req.user.id;
    console.log(userId);
    const user=await User.findById(userId);

   try {
    // Check if user exists
    if(!user){
        console.log('user does not exists');
    }
    const {password}=req.body;

    //validate
    if(!password ){
        return res.status(403).json({
            success:false,
            message: "You must provide a valid password to continue.",
        })
    }

    // check given password by db
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            success:false,
            message: "Invalid credentials.",
        })
    }

    // if password matches delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
        success:true,
        message:'user account deleted'
    })
   } catch (error) {
    console.log(error)
     return res.status(200).json({
        success:true,
        message:'internal server error'
    })
   }
}

// forgot password
exports.forgotPassword = async(req,res)=>{
   
    // fetch data
    const {email}=req.body;
    // validate
    if(!email){
        return res.json({
            success: false,
            message:"fill all fields"
        })
    }
    try {
        // check user exists or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: 'User does not exist.',
            })
        }

        // if user exists generate otp
    
        let otp = otpGenerator.generate(6, { alphabets: false, upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });

        // Calculate expiration time (e.g., 5 minutes from now)
      
        const expirationTime = new Date();
        expirationTime.setSeconds(expirationTime.getSeconds() + 10); // 30 sec from now



        // save the otp to db
        await User.findByIdAndUpdate(user.id,{otp:otp, otpExpiresAt: expirationTime}, {new: true})

        // send mail with nodemailer
        const subject= "Reset Password";
        const text= `Your OTP is ${otp}`;
        
        sendEmail(email, subject, text);

        res.status(200).json({
            success:true,
            message: "OTP has been sent to your registered Email",
        })

    } catch (error) {
        console.log('error while sending otp',error)
         res.status(500).json({
            success:false,
            message: "internal server error",
        })
    }
}

// update userdeatils
exports.updateUserDetails = async(req,res)=>{
    const userData= req.user;
    const userId=req.user.id;
    console.log(userId);
   
    try {
        const user= await User.findById(userId);
        //  check whether user exist or not
        if(!user){
            console.log('user does not exists');
            return res.status(400).json({
                success: false,
                message:"Invalid credentials"
            });
        }
        // get data from req
        const {username,bio,firstName,lastName}=req.body;
        // now update user
        const updatedUser=await User.findByIdAndUpdate(userId,{
            username,
            firstName,
            lastName,
            bio,

        },{new:true})
       console.log(updatedUser);
        // return res
        return res.status(200).json({
            success:true,
            updatedUser:updatedUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Server Error'
        })
    }
}