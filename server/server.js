const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();



app.use("/api/users", require("./routes/userRoute"));



const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>{
    try {
        console.log(`Server running on port ${PORT}`)
    } catch (error) {
        console.log(`Server Error ${error}`)
    }
})
