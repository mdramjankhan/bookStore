const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name:{type:String},
    price:{type:Number},
    category:{type:String},
    image:{type:String},
    title:{type:String}
});

module.exports = mongoose.model("Book",bookSchema);