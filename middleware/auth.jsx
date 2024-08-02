const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const cookies = require("cookies-parser");


//auth
exports.auth = async (req,res,next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            });
        }

        //verify the token

        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;


        } catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });

        }
        next();


    } catch(err){
        return res.status(400).json({
            success:false,
            message:"authorisation failed"
        });

    }
}




//isStudent

exports.isStudent = async (req,res,next)=>{
    try{

        if(req.user.accountType !=="Student"){
              return res.status(401).json({
                success:false,
                message:"this is protected routes only for student"
            });
        }
        next();



    } catch(err){
        return res.status(500).json({
            success:false,
            message:"user role is not verified"
        });
    }
}





//isInstructor

exports.isInstructor = async (req,res,next)=>{
    try{

        if(req.user.accountType !=="Instructor"){
              return res.status(401).json({
                success:false,
                message:"this is protected routes only for instructor"
            });
        }
        next();



    } catch(err){
        return res.status(500).json({
            success:false,
            message:"user role is not verified"
        });
    }
}




//isAdmin
exports.isAdmin = async (req,res,next)=>{
    try{

        if(req.user.accountType !=="Admin"){
              return res.status(401).json({
                success:false,
                message:"this is protected routes only for Admin"
            });
        }
        next();



    } catch(err){
        return res.status(500).json({
            success:false,
            message:"user role is not verified"
        });
    }
}