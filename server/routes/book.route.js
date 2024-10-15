const express = require("express");
const router = express.Router();
const {getBook} = require("../controllers/book.controller");

router.get("/book",getBook);

module.exports = router;