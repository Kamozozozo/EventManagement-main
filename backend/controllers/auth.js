
import organizer from "../model/EventOrganizers.js";
import admin from "../model/admin.js";
import students from "../model/Students.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCode from "../utils/generateToken.js";
import Venue from "../model/Venue.js";
import nodemailer from "nodemailer"
import Mailgen from "mailgen";
import Subscription from "../model/Subscribes.js";

export const subscribe = async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;
    const userId = req.user._id;
    const userFaculty = req.user.faculty;
    const userStudyLevel = req.user.StudyLevel;

    console.log("Received subscription data:", req.body);

    try {
        // Check if the user already has a subscription in the database
        const existingSubscription = await Subscription.findOne({ userId });

        if (existingSubscription) {
            // Update the existing subscription with new details if the endpoint has changed
            if (existingSubscription.subscription.endpoint !== endpoint) {
                existingSubscription.subscription = {
                    endpoint,
                    expirationTime,
                    keys,
                };
                await existingSubscription.save();
                return res.status(200).json({ message: "Subscription updated" });
            } else {
                return res.status(200).json({ message: "Subscription already exists" });
            }
        } else {
            // Create a new subscription if none exists
            await Subscription.create({
                userId,
                subscription: {
                    endpoint,
                    expirationTime,
                    keys,
                },
                faculty: userFaculty,
                StudyLevel: userStudyLevel,
            });

            return res.status(201).json({ message: "Subscription saved" });
        }
    } catch (error) {
        console.error("Error saving subscription:", error);
        res.status(500).json({ message: "Failed to save subscription", error: error.message });
    }
};

export const signup = async (req, res) => {
 

    try {
        const { name, email, password, confirmPassword,motivation ,role } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailRegex.test(email)){
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }
    
            // Check if user already exists
            const User = await organizer.findOne({ email });
            if (User) {
                return res.status(400).json({ message: "Email already exists" });
            }
            //confimation email
        
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const verificationCode=Math.floor(1000 +Math.random() * 90000).toString()
            // Create new user
            const newUser = new organizer({
                name,
                email,
                password: hashedPassword,
                Motivation:motivation,
                role,
                verificationCode
               

            });
            
            if(newUser){
                generateTokenAndSetCode(newUser._id, res);
                await newUser.save();
                return res.status(201).json({ message: "request sent successfully" });
                //send email  with pass and email attached
            }
    
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                Motivation:newUser.Motivation,
                role: newUser.role,
            });

        }
        else{
            return res.status(400).json({ message: "Invalid email" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const addStudent= async (req,res)=>{
    try {
        const { name , surname, password, role,faculty,StudyLevel,StudentNumber } = req.body;
        console.log(name , surname, password, role,faculty,StudyLevel,StudentNumber )
        const studentNumberRegex = /^[0-9]{9}$/
        if(!studentNumberRegex.test(StudentNumber)){
            return res.status(400).json({ message: "Invalid student number" });

        }
        const existingUser = await students.findOne({ StudentNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Student number already exists" });
            }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new students({
                name,
                surname,
                password: hashedPassword,
                role,
                faculty,
                StudyLevel,
                StudentNumber
                });
                await newUser.save();
                return res.status(201).json({ message: "Student Added successfully" });
                //send email  with pass and email attached
                }catch{
                    return res.status(500).json({ message: "Internal server error" });
                }
            

}
export const verifyEmail =async(req,res)=>{
    try {
        const { email, verificationCode} = req.body;
        const user = await organizer.findOneAndUpdate({ email,verificationCode },{isVerified:true});
        if(!user){
            return res.status(400).json({ message: "Invalid email or verification code" });
            
        }
        return res.status(200).json({ message: "Email verified successfully" });
    
    }
    catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        })
    }
    
}
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const studentNumberRegex = /^[0-9]{9}$/; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        let user = null;
        if (studentNumberRegex.test(email)) {
            user = await students.findOne({ StudentNumber: email }); 
        } 
        else if (emailRegex.test(email)) {
            user  = await organizer.findOne({ email,isVerified:true }); 
            if (!user) {
                user = await admin.findOne({ email }); 
            }

        } 
        else {
            return res.status(400).json({ error: "Please enter a valid email or student number." });
        }
        if (!user) {
            return res.status(400).json({ error: `No user found or yet to be verified` });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Wrong password" });
        }

    
        generateTokenAndSetCode(user._id, res);

      
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Logout error" });
    }
};

