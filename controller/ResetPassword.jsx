const User = require("../models/User");
const mailSender = require("../utills/mailSender");





//resetPasswordToken

exportx.resetPasswordToken = async (req,res)=>{
    try{



    //get email form req body
    const email = req.body.email;


    // check user for this email
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"user does not exist",
        })
    }


    //generate token

    const token  = crypto.randomUUID();


    //udate user by adding token and expiration 
    const updatedDetails = await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now()+5*60*60,
    },{new:true});






    const url = `http://localhost:3000/update-password/${token}`

    await mailSender(email,"Password Reset Link " ,`Passwword reset link :${url}` );

    return rse.status(500).json({
        success:true,
        message:"Email for reset successful"
    });
} catch(error){
    return 
}
}





//reset password