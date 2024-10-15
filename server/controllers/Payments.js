const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");

exports.capturePayment = async (req,res) => {

    //get courseId and userId
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    if(!course_id) {
        return res.status(400).json({success:false,message: "Please provide valid course id"});
    }
    //valid courseDetails
    let course;
    try {
        course = await Course.findById(course_id);
        if(!course) {
            return res.status(400).json({success:false,message: "Course not found"});
        }
        //user alreary pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(400).json({success:false,message: "You have already enrolled for this"});
        }
    }
    catch(e) {
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message,
        });
    }
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount:amount * 100,
        currency,
        reciept:Math.random(Date.now()).toString(),
        notes: {
            courseId:course_id,
            userId,
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponce = await instance.orders.create(options);
        console.log(paymentResponce);
        //return responce
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponce.id,
            currency:paymentResponce.currency,
            amount:paymentResponce.amount,
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
}

//verify signature of razorpay and server

exports.verifySignature = async (req,res) => {
    const webhookSecret = "122345566";

    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is authorized");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try {
            //fullfill the action

            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { enrolledStudents: userId } },
                { new: true }
            );

            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                    });
            }
            console.log(enrolledCourse);

            //find the student and add the course to their list enrolled courses me
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true }
            );
            console.log(enrolledStudent);

            //mail send krdo confirmation wala
            const emailResponce = await mailSender(
                enrolledStudent.email,
                "Congratulation from codehelp",
                "Congratulations, you are onboarded into new CodeHelp Course",
            );

            console.log(emailResponce);
            return res.status(200).json({
                success: true,
                message: "Sinature verification and Course added",
                });
        }
        catch(e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: e.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
    }
}