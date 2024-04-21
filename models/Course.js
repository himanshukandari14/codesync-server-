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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
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
        default:'https://i.ytimg.com/vi/eIQh02xuVw4/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC0Wt4SP86a7DGnLPGiyBNfmDqucA'
    },
    ratings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tags:{
        type:String,
        enum:['development','data-science','artificiall-intelligence']
    },
    
});

// Creating the Course model
const Course = mongoose.model('Course', courseSchema);

// Exporting the Course model
module.exports = Course;
