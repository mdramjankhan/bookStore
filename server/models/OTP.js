const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
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

//  a function -- to send mail
async function senVerificationEmail(email,otp) {
    try {
        const mailResponce = await mailSender(email, "verification Email from StudyNotion", otp);
        console.log("Email send successfully", mailResponce);
    }
    catch(e) {
        console.log("error occurred while sending mail:", e);
        throw e;
    }
}


OTPSchema.pre("save", async function(next) {
    await senVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP",OTPSchema);