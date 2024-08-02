const User = require("../models/User");
const OTP = require("../models/otp");
const OTPGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//otpSend

exports.sendOTP = async (req,res) =>{

    try{
    // fetch email from body
    const {email} = req.body;

    //check if user alredy exist

    const checkUserState  = await User.findOne({email});
    if(checkUserState){
        return res.status(401).json({
            success:false,
            message:"User alredy registered"
        })

    }
    // generate otp 
    var otp = OTPGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });

    // check unique otp
    const result = await OTP.findOne({otp:otp});

    while(result){
        otp = OTPGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        result = await OTP.findOne({otp:otp});

        const payLoad = {email,otp};

        // create an otp in db

        const otpBody = OTP.create(payLoad);

        res.ststue(200).json({
            success:true,
            message:"OTP generate successful",
        })

    }







} catch(err){
    console.log("Fail in otp generator")
    return res.ststus(500).json({
        success:false,
      
        message:err.message
    })
}


}


//signup

exports.signup = async (req,res)=>{

    try{


    // data fetch from body 
    const {firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;




    //validate karo email

    if(!firstName || !lastName || !email || !password || !confirmPassword   || !otp){
        return res.status(403).json({
            success:false,
            message:"Please fill all field"
        })
    }



    // match 2 otp response
    if(password !== confirmPassword){
        return res.status(400) .json({
            success:false,

            message:"password and confirm Password  are not matched"
        })
    }


    // check user alredy exist

    const userExistStatus = User.findOne({email});
    if(userExistStatus){
        return res.status(400).json({
            success:false,
            message:"User already registered"
        })
    }


    //find most recent OTP for the user

    const otpFindFromDBRecent  = await OTP.find({email}).sort({createdAt:-1}).limit(1); /// -1 is used for sorting in descending order 
    // 1 for sorting at ascending order

    //validate OTP

    if(otpFindFromDBRecent == 0 ){
        //otp are not found in database
        res.status(400).json({
            success:false,
            message:"otp are not found"
        })
    }
    else if(otp !== otpFindFromDBRecent.otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
        })
    }



    //Hash password

    const hashPassword = await bcrypt.hash(password , 10);



    // create entry in database
    const profileDetail = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    });




    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashPassword,
        accountType,
        additionalDetail:profileDetail._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
 

    })

    return res.status(200).json({
        success:true,
        message:"User registered successful",
        user,
    })
} catch(err){
    return res.status(500).json({
        success:false,
        message:"fail in registration try again"
    })

}

}



//login

exports.login  = async (req,res)=>{
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"please fill all field"
            })
        }
        
        const user = await User.findOne({email}).populate("additionalDetai");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered , please goto signup",
            })
        }

        if(await bcrypt.compare(password , user.password)){

            const payload = {
                email:user.email,
                id:user._id,
                role:user.accountType,
            }
            const token  = jwt.sign(payload , process.env.JWT_SECRET, {
                exprires:"2h",
               
            });
            user.token = token;
            user.password = undefined;
            const option = {
                exprires:new Date.now()+3*24*60*60*1000,
                httpOnly:true,
            }

            res.cookies("token",token,option).status(200).json({
                success:true,
                token,
                user,
                message:"user logged successful"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"password is incorrect",
            })
        }



    } catch(err){
        return res.status(500).json({
            success:false,
            message:"login failed try again"
        })
    }
}




//change otp



