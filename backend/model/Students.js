import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    surname:{
        type:String,
        required:true
    },
    StudentNumber:{
        type:Number,
        required:true
    },
    faculty: {
        type: String,
        enum:["COMMERCE,ADMINISTRATION AND LAW","EDUCATION","ENGINEERING, SCIENCE AND AGRICULTURE","HUMANITIES AND SOCIAL SCIENCE"]
    },
    StudyLevel: {
        type: String,
        enum: ["postgrad", "undergrad"]
    },
    password: {
        type:String,
        required:true,
        minlength:7,
        unique:true
    },

    role: {
        type:String,
        default:"Student"
    },
});
const students = mongoose.model("Students", userSchema);
export default students;
