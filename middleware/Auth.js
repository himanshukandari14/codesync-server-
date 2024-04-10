const jwt=require('jsonwebtoken');
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





 module.exports={verifyToken,generateToken}