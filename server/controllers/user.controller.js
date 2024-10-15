const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");

exports.signup = async(req,res) => {
    try {
        const {fullname, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({success:false,message: "Email already exists"});
        }
        // const user = await User.create({fullname, email, password});
        const hashedPassword = await bcrypt.hash(password,10);
        const createUser = new User({
            fullname,
            email,
            password:hashedPassword,
        });
        const user = await createUser.save();
        return res.status(201).json({success:true,message: "User created successfully",user:{
            _id:createUser._id,
            fullname:createUser.fullname,
            email:createUser.email
        }});
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({success:false,message: "Internal server error"});
    } 
};


exports.login = async(req,res) => {
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(!email || !password) {
            return res.status(400).json({success:false,message: "Please enter both email and password"});
        }
        if(!existingUser) {
            return res.status(400).json({success:false,message: "Email already exists"});
        }
        // const user = await User.create({fullname, email, password});
        const checkPassword = await bcrypt.compare(password,existingUser.password);
        if(!checkPassword) {
            return res.status(500).json({success:false,message: "Wrong Password, Login failed"});
        }
        return res.status(201).json({success:true,message: "Login successfully",
            existingUser:{
                fullname: existingUser.fullname,
                email: existingUser.email,
                _id:existingUser._id
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({success:false,message: "Internal server error"});
    } 
};