// Importing required modules
const mongoose = require('mongoose');

// Creating the Course schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    studentsEnrolled:[ {
        type: mongoose.Schema.Types.ObjectId,
    }],
    thumbnail:{
        type:String,
        required:true,
    },
    ratings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
});

// Creating the Course model
const Course = mongoose.model('Course', courseSchema);

// Exporting the Course model
module.exports = Course;
