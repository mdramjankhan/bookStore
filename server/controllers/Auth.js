const User = require("../models/User");
const OTP = require("../models/OTP");
const otpgenerator = require('otp-generator');
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//----------------------------------------------------------------------------------->
// send otp
exports.sendOTP = async (req, res) => {
    try {
        //fetch email from email ki body
        const { email } = req.body;

        //check if user is already exist
        const checkUserPresent = await User.findOne({ email });

        //if user already exist then return responce
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            })
        }

        let otp = otpgenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("otp generated: ", otp);

        //making it unique
        //chekh unique otp or not
        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpgenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return responce
        res.status(200).json({
            success: true,
            message: "OTP send successfully",
            otp,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
//----------------------------------------------------------------------------------->


// // signup
// exports.signup = async (req, res) => {
//     try {
//         //data fetch from req.body
//         const {
//             firstName,
//             lastName,
//             email,
//             password,
//             confirmPassword,
//             accountType,
//             contactNumber,
//             otp
//         } = req.body;

//         //validate data
//         if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
//             return res.status(403).json({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }
//         //2 password match
//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password and Confirm Password does not match, please try again",
//             });
//         }
//         //check user is exist or not
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User is already registered",
//             });
//         }

//         //find most recenr OTP stored for the user
//         const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
//         console.log(recentOtp);
//         //validate otp
//         if (recentOtp.length == 0) {
//             //otp not found
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP not found",
//             });
//         } else if (otp !== recentOtp[0].otp) {
//             //invalid otp
//             res.status(400).json({
//                 success: false,
//                 message: "Invalid Otp",
//             });
//         }

//         //hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         //entry create in db
//         const profileDetails = await Profile.create({
//             gender: null,
//             dateOfBirth: null,
//             about: null,
//             contactNumber: null,
//         });
//         const user = await User.create({
//             firstName,
//             lastName,
//             email,
//             contactNumber,
//             password: hashedPassword,
//             confirmPassword,
//             accountType,
//             additionalDetails: profileDetails._id,
//             image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
//         });

//         //return res
//         return res.status(200).json({
//             success: true,
//             message: "User is registered Successfully",
//             user,
//         });
//     }
//     catch (e) {
//         console.log(e);
//         return res.status(500).json({
//             success: false,
//             message: "User cannot be registered please try again",
//         });
//     }

// }

//login



//----------------------------------------------------------------------------------->
//signup controller
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        if (!profileDetails) {
            return res.status(500).json({
                success: false,
                message: "Failed to create profile",
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User is registered Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
};
//----------------------------------------------------------------------------------->


//----------------------------------------------------------------------------------->
//login controller
exports.login = async (req,res) => {
    try {
        //get data from req.body
        const { email, password } = req.body;
        //validation data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, please try again",
            });
        }
        //check user exist or not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered, please signin first",
            });
        }
        //generate jwt, after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            //create cookie and send responce
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            });
        }
        else {
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success:false,
            message:"Login failure please try again",
        });
    }
}
//----------------------------------------------------------------------------------->



//----------------------------------------------------------------------------------->
//change password
exports.changePPassword = async(req,res) => {
    // get data from the req body
    //get oldPassword, newpassword, confirm password,
    //validation

    //update pwd in DB
    //send mail - pasword updated
    //return responce
}

//----------------------------------------------------------------------------------->
exports.changePassword = async (req, res) => {
    try {
        // Step 1: Get data from request body
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Step 2: Validate input data
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields (old password, new password, confirm password) are required",
            });
        }

        // Step 3: Ensure the new password matches confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }

        // Step 4: Get user from the database
        const userId = req.user.id;  // Assuming user ID is available from JWT middleware
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Step 5: Compare old password with the current password in the database
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Step 6: Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Step 7: Update the user's password in the database
        user.password = hashedNewPassword;
        await user.save();

        // Step 8: Send response indicating success
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while changing the password, please try again later",
        });
    }
};
//----------------------------------------------------------------------------------->


//for log out
exports.logout = async (req, res) => {
    try {
        // Clear the JWT token by setting it to an empty string and expiring it
        res.cookie("token", "", {
            expires: new Date(Date.now()), // Expire the cookie immediately
            httpOnly: true,  // Ensure it's an HTTP-only cookie
            secure: true,    // Use 'secure: true' in production for HTTPS
            sameSite: 'strict', // Prevent CSRF by using 'strict' or 'lax'
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging out, please try again later",
        });
    }
};
