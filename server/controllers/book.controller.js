const Book = require("../models/book.model");

exports.getBook = async(req,res) => {
    try {
        const book = await Book.find();
        res.status(200).json({
            success:true,
            message:"fethed successfully",
            book,
        });
    }
    catch (e) {
        res.status(500).json({success:false, message: e.message });
    }
};