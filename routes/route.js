const express=require('express');
const router=express.Router();


// import controllers
const { register, login, resetPassword, deleteUser,getUser, forgotPassword, updateUserDetails } = require('../controllers/Auth');
const {verifyToken, isMentor}=require('../middleware/Auth');
const { createCourse, deleteCourse, getAllCourse, getCourse, addToCart,searchCourse } = require('../controllers/Course');

router.post('/register',register);
router.post('/login',login)
router.get('/getuser',verifyToken,getUser);
router.post('/resetpassword',verifyToken,resetPassword);
router.delete('/deleteuser',verifyToken,deleteUser);
router.post('/forgotPassword',forgotPassword);


// course  routes

router.get('/allcourses',verifyToken,getAllCourse);
router.get('/testmentor', verifyToken, isMentor, (req, res) => {
    res.send("This is a test mentor route");
    console.log('Test route accessed by mentor');
});

router.post('/createcourse',verifyToken,isMentor,createCourse);
router.delete('/deleteCourse/:id', verifyToken, deleteCourse); 
router.get('/course/:id',verifyToken,getCourse);
router.get('/user/search',searchCourse);
router.post('/user/updateDetails',verifyToken,updateUserDetails)
router.delete('/deleteaccount',verifyToken,deleteUser);

module.exports=router;