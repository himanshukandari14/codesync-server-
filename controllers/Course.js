const Course=require('../models/Course');
const User = require('../models/User');
const bcrypt= require('bcrypt');
const Cart= require('../models/Cart');
// create course
exports.createCourse = async(req,res)=>{
    // get user
    const userData=req.user;
    const userId=req.user.id;
    console.log(userId);

    const loggedinUser=await User.findById(userId);
    console.log(loggedinUser)

    // fetch data
    const {title,description,user,price,duration,thumbnail}=req.body;

    // validate
    if(!(title || description || price || duration || thumbnail)){
        return res.status(400).json({msg:"Please enter all fields"});
    }
    try {
        // save it in database
        const course=await Course.create({
            title,
            description,
            price,
            duration,
            thumbnail,
        });

        // add course in user's courses list
        loggedinUser.courses.push(course._id);
        await loggedinUser.save();


        // res 
        return res.status(200).json({
            message:'Course created successfully',

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"error while creating course"});
    }
}

exports.deleteCourse = async(req,res)=>{

    // user
    const userId=req.user.id;
    console.log(userId)
    const courseId=req.params.id;

    try {
         const user=await User.findById(userId);
    // fetch password before delete course
    const{password}= req.body;

    // validation
    if(!password){
        return res(400).json({msg: "please provide your current password"})

    }
    // match pass with db
    isMatch=await bcrypt.compare(password,user.password);
    
    if (!isMatch) {
        return res.status(401).json({ msg: 'Password incorrect' });
      }
      
    // remove the course from users
    user.courses.pull(courseId);
    await user.save();


    // delete that course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json("Deleted Successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success:false, message: 'internal serve error' });
    }

   
}

// get alllcourse
exports.getAllCourse = async(req,res)=>{
    try {
        const allCourses = await Course.find({});
        console.log(allCourses);
        return res.status(200).json({
            success:true,
            courses : allCourses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false ,message:'Internal server Error!'});
    }
}

// get a course
exports.getCourse = async(req,res)=>{
    const courseId=req.params.id;

    try {
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success:false, 
                message:"No such course found"
            })
        }
        console.log(course);

        return res.status(200).json(({
            success: true,
            course: course,
        }))
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false, 
            error: "Server Error!"
        });
    }
}

// search user from search bar
exports.searchCourse=async(req,res) => {
  const {query} = req.query;
  try {
    const searchResults = await Course.find({title :{$regex : new RegExp(query, 'i')}})
    return res.json(searchResults);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


