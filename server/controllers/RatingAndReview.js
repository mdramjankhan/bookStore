const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

//createRating
exports.createRating = async(req,res) => {
    try {
        //get data
        const userId = res.user.id;
        //fetchdata from req.body
        const {rating,review, courseId} = req.body;
        //chech if user is enrolled or not
        const courseDetails = await Course.findOne(
                                        {_id:courseId,
                                            studentsEnrolled:{$elemMatch:{$eq:userId}},
                                        }
        );
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in the course",
            });
        }
        //check is uer is already reviewed the course
        const alreadyReviewed = await RatingAndReviews.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message:"COurse is alreay reviewed",
            });
        }

        //create a rating and review
        const ratingReview = await RatingAndReviews.create({
            rating,review,course:courseId,user:userId
        });

        //update course with this rating and review
        const updatedCourseDetails =  await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews:ratingReview._id,
                }
            },
            {new:true},
        );
        console.log(updatedCourseDetails);
        //return responce
        return res.status(200).json({
            success:true,
            message:"Rating and Reviews created successfully",
            ratingReview,
        });
    }
    catch(e) {
        console.log(e);
        return res.status(500).json({
            success:false,
            message:"error.message",
        });
    }
};


// getAverageRating
exports.getAverageRating = async(req,res) => {
    try {
        //get courseId
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])

        //rerturn rating
        if(result.length > 0 ) {
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        }
        //if no rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no rating given till now",
            averageRating:result[0].averageRating,
        });
    }
    catch(e) {
        return res.status(500).json({
            success:false,
            message:e.message,
        });
    }
};


//getAllRatingAndReviews
exports.getAllRating = async(req,res) => {
    try {
        const allReviews = await RatingAndReviews.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courseName",
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews,
        });
    }
    catch(e) {
        return res.status(500).json({
            success:false,
            message:e.message,
        });
    }
};