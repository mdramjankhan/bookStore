const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswodToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req.body
        const {email} = req.body;
        //check user for this email, email validation
        const user = await User.findOne({ email});
        if (!user) {
            return res.json({
                success: false,
                message: "Your email is not registered with us",
            });
        }
        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + (5 * 60 * 1000) + 1000
            },
            { new: true },
        )

        // create url 
        const url = `http://localhost:5173/update-password/${token}`
        //send mail containing the url
        await mailSender(email,
            "Password reset Link",
            `Password reset Link: ${url} `);

        //return responce
        return res.json({
            success: true,
            message: "Email send successfully, please check email and change password",
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset pwd mail"
        });
    }
}


//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body;
        //validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "password not matching",
            });
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({ token: token });
        //if no entry --invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid",
            });
        }
        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please regenerate the token",
            });
        }
        //hash the password
        const hashPasword = await bcrypt.hash(password, 10);
        //update the password
        await User.findOneAndUpdate(
            { token: token },
            { password: hashPasword },
            { new: true },
        );
        //responce return
        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset pwd mail"
        });
    }
}
