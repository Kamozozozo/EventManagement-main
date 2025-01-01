import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{ 
        type:String,
        required:true,
        unique:true
        
    },
    password: {
        type:String,
        required:true,
        minlength:7,
        unique:true
    },
    Motivation:{
        type:String,
        required:true
    },
    role: {
        type:String,
        enum:["Organizer"],
        default:"Organizer",
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:String
},{timestamps:true});
const organizer= mongoose.model("Organizer", userSchema);
export default organizer;
