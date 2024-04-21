const jwt=require('jsonwebtoken');
const { findById } = require('../models/User');
const User = require('../models/User');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // First, check that req header has authorization or not
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ error: 'Token not found' });
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log("Token is:", token); // Check if token is correctly extracted
    try {
        // Verify jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user information to req object
        req.user = decoded.userData;
        console.log("User data attached to req:", req.user); // Check if user data is correctly attached
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ success: false, message: "Invalid token." });
    }
};

// func to generate token
const generateToken = (userData) => {
    return jwt.sign({userData},process.env.JWT_SECRET,{ 
        expiresIn:'2h'
    });

}


// other middleware
// is student
// const isStudent= async(req,res,next)=>{
//     try {
//         if(req.user.userType !== "student"){
//             return res.status(401).json({
//                 success:false,
//                 message:"this is a protected routes for students only"

//             });
//             next();
//         }
//     } 
//     catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:'user role cannot be verified try again'
//         })
//     }
// }

// is instructor

// is instructor
const isMentor = async (req, res, next) => {
    const  userId= req.user.id;
    const user=await User.findById(userId);
    console.log('the user id is =>',userId)
    try {
        if (user.userType !== "mentor") {
            console.log('hello',req.user);
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructors only"
            });
           
        }
         
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        });
    }
}


 module.exports={verifyToken,generateToken,isMentor}