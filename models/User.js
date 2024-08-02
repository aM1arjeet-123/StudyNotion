const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        
    }
    ,
    account:{
        type:String,
        enum:["Admin", "Student" , "Instructor"],
        required:true,
    }
    ,
    additionalDetail:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course",


    }
    ,
    image:{
        type:String,
        required:true,
    }
    ,

    token:{
        type:String,
    }
    ,
    resetPasswordExpires:{
        type:Date,
    }
    ,
    courseProgress:{
        type:String,
        ref:"CourseProgress",
    }
})

module.exports = mongoose.model("User" , userSchema);