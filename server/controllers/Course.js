const Course = require("../models/Course");
const Catagory = require("../models/catagory");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const catagory = require("../models/catagory");
require("dotenv").config();

//createCourse handler function
// exports.createCourse = async(req,res) => {
//     try {
//         //fetch data
//         const {courseName,courseDescription, whatYouWillLearn, price, catagory} = req.body;

//         //Get thumbnail
//         const thumbnail = req.files.thumbnailImage;

//         //validation
//         if(!courseName || !courseDescription || !whatYouWillLearn || !price || !catagory || !thumbnail)  {
//             return res.status(400).json({success:false,message: "Please fill all fields"});
//         }

//         //check for instructor
//         const userId = req.user.id;
//         const instructorDetails = await User.findById(userId);
//         // console.log("Instructor details: ",instructorDetails);

//         if(!instructorDetails) {
//             return res.status(400).json({success:false,message: "instructor detetails not found"});
//         }

//         //check given catagory is valide or not
//         const catagoryDetails = await Catagory.findById(catagory);
//         if(!catagoryDetails) {
//             return res.status(400).json({success:false,message: "catagory details not found"});
//         }

//         //upload image to cloudinary
//         const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

//         //create an entry for new course
//         const newCourse = await Course.create({
//             courseName,
//             courseDescription,
//             instructor:instructorDetails._id,
//             whatYouWillLearn,
//             price,
//             catagory:catagoryDetails._id,
//             thumbnail:thumbnailImage.secure_url,
//         });

//         //add the new course  to the user scheema of instructor
//         await User.findByIdAndUpdate(
//             {_id:instructorDetails._id},
//             {
//                 $push:{courses:newCourse._id}
//             },
//             {new:true},
//         );

//         //update the catagory scheema
//         // TODO 

//         // return respoce
//         res.status(201).json({success:true,message:"Course created successfully",data:newCourse});

//     }
//     catch(e) {
//         console.log("Error: ",e);
//         res.status(500).json({success:false,message:"failed to create cource",error:e.message});
//     }
// }







exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, catagory } = req.body;

        console.log(courseName," ", courseDescription, " ", whatYouWillLearn," ",price," ", catagory);
        //Get thumbnail
        const thumbnail = req.files.thumbnailImage;
        console.log(thumbnail);

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !catagory) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(400).json({ success: false, message: "instructor detetails not found" });
        }

        //check given catagory is valide or not
        const catagoryDetails = await Catagory.findById(catagory);
        // console.log(catagory);
        if (!catagoryDetails) {
            return res.status(400).json({ success: false, message: "catagory details not found" });
        }

        let thumbnailImage;
        //upload image to cloudinary
        try {
            thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
            console.log(thumbnailImage);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to upload thumbnail to Cloudinary", error: error.message });
        }

        let newCourse;
        //create an entry for new course
        try {
            newCourse = await Course.create({
                courseName,
                courseDescription,
                instructor: instructorDetails._id,
                whatYouWillLearn,
                price,
                catagory: catagoryDetails._id,
                thumbnail: thumbnailImage.secure_url,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to create course", error: error.message });
        }

        //add the new course  to the user scheema of instructor
        try {
            await User.findByIdAndUpdate(
                { _id: instructorDetails._id },
                {
                    $push: { courses: newCourse._id }
                },
                { new: true },
            );
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to update instructor courses", error: error.message });
        }

        //update the catagory scheema
        // TODO 

        // return response
        res.status(201).json({ success: true, message: "Course created successfully", data: newCourse });
    } catch (e) {
        console.log("Error: ", e);
        res.status(500).json({ success: false, message: "failed to create course", error: e.message });
    }
}








//getAllCours`es handler function
exports.showAllCourses = async (req, res) => {
    try {
        //todo---->
        const allCourses = await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,})
                                                .populate("instructor")
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses,
        });
    }
    catch(e) {
        console.log("Error: ",e);
        res.status(500).json({success:false,message:"failed to get all courses", });
    }
}

//getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try {
        //fetch course id
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.find({_id:courseId})
                                                            .populate(
                                                                {
                                                                    path:"instructor",
                                                                    populate:{
                                                                        path:"additionalDetails",
                                                                    },
                                                                }
                                                            )
                                                            // .populate("category")
                                                            // .populate("ratingAndreviews")
                                                            .populate({
                                                                path:"courseContent",
                                                                populate:{
                                                                    path:"subSection",
                                                                }
                                                            }).exec();
        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        //return rsponce
        return res.status(200).json({
            success:true,
            message:"Course details fetcheda successfully",
            data:courseDetails,
        });
    }
    catch(e) {
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message,
        });
    }
};