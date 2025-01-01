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
    role: {
        type:String,
        enum:["Organizer","Student","Admin"],
        default:"Student"
    },
});
const user = mongoose.model("User", userSchema);
export default user;
