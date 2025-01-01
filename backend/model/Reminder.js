import mongoose from "mongoose";
const ReminderSchema = new mongoose.Schema({
    eventID:String,
    userID:String,
    eventName:String,
    eventDate:Date,
    time: String,
    venue:String
});
const reminder = mongoose.model("reminders", ReminderSchema);
export default reminder;
