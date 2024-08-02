const mongoose = require("mongoose");
const mailSender = require("../utills/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,

    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,

    }
});


// a function -> intend to send email

async function sendVerificationEmail(email , otp){


    try{
        const mailSender = await mailSender(email, "verification of email by studynotion" , otp);
        console.log("mail send successful");
    } catch(err){
        console.log("error will occured send mail");
        throw error;
    }
}


otpSchema.pre("save" , async function(next){
    await sendVerificationEmail(this.email , this.otp);
    next();

})

module.exports = mongoose.model("OTP" , otpSchema);