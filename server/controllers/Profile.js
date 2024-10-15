const Profile = require("../models/Profile");
const User = require("../models/User");

//update Profile
exports.updateProfile = async (req, res) => {
    try {
        //get data
        const {dateOfBirth="", about="",contactNumber, gender} = req.body;
        //get user data
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender){
            return res.status(400).json({success:false,message: "Please fill all fields"})
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        //return responce
        res.status(200).json({success:true,message: "Profile updated successfully",profileDetails});
    }
    catch (e) {
        res.status(200).json({success:true,message: "Profile updated successfully",error:e.message});
    }
};

//account deletion function
//Explore -  how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try { 
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({success:false,message: "User not found"});
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO HM : unroll user from all enrolled cources
        //delete user
        await User.findByIdAndDelete({_id:id});
        //reurn responce
        res.status(200).json({success:true,message: "User deleted successfully"});
    }
    catch(e) {
        console.log(e);
        return res.status(500).json ({
            success: false,
            message: "Error deleting user",
        });
    }
};


exports.getAllUserDetails = async(req,res) => {
    try {
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return responce
        return res.status(200).json({success:true,message: "User details fetched successfully",userDetails});
    }
    catch(e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Error fetching user details",
        });
    }
};


const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateDisplayPicture = async (req, res) => {
    try {
        // Check if the image file is present in the request
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image file",
            });
        }

        // Get the image file from the request
        const imageFile = req.files.image;

        // Get the user's ID from the request (assuming middleware sets req.user.id)
        const id = req.user.id;

        // Find the user in the database
        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Upload the image to Cloudinary
        const result = await uploadImageToCloudinary(imageFile, "profile_pictures", 500, 80);

        // Update the user's image with the Cloudinary URL
        userDetails.image = result.secure_url;
        await userDetails.save();

        // Return success response with updated user details
        return res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            userDetails,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile image",
            error: e.message,
        });
    }
};
