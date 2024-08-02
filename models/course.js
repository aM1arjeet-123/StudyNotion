const mongoose  = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName:{
    type:String,
    trim:true,
    required:true,
  },
  instructor:{
    type:String,

  },
    type:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    courseDescription:{
        type:String,
    },
    whatWillLearn:{
        type:String,
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },
    ratingAndReview:{
        type:mongoose.Schema.Types,ObjectId,
        ref:"RatingAndReview",
    },
    price:{
        type:Number,
    },
    thumbNail:{
        type:String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tags"
    },
    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }],
  
})

module.exports = mongoose.model("Course" , courseSchema);