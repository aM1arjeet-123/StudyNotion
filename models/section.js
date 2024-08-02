const mongoose  = require("mongoose");
const subSection = require("./subSection");

const sectionSchema = new mongoose.Schema({
   sectionName:{
    type:String,
   },
   subSection:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"SubSection",
   }
})

module.exports = mongoose.model("section" , sectionSchema);