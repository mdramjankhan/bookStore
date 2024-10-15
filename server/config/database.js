// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = () => {
//     mongoose.connect(process.env.MONGODB_URL)
//     .then(()=> {
//         console.log("Connected to MongoDB");
//     })
//     .catch((e)=> {
//         console.log("Error connecting to MongoDB");
//         console.log(e);
//         process.exit(1);
//     })
// };

const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB successfully');
    } catch (e) {
        console.log("Db connection error: ", e);
        process.exit(1);
    }
}