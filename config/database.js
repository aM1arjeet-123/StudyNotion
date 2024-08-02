const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE)
    .then(()=>{console.log("database connected")})
    .catch((err)=>{console.log("database connection failed")
        process.exit(1);
    });
}
module.exports = dbConnect;

