const express = require("express");
const app = express();
const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");

require("dotenv").config();

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials:true,
    })
)


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",
}
));

//cloudinary connect
// cloudinaryConnect();

//routes
app.use("/api",bookRoute);
app.use("/api",userRoute);


//def route
app.get("/", (req,res) => {
    return res.json({
        success:true,
        message:"your sever is up and routing...",
    });
});

app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
});