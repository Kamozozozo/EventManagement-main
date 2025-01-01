import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
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
    role: {
        type:String,
        default:"Admin",
        required:true
    },
});
const admin= mongoose.model("Admin", userSchema);
export default admin;
