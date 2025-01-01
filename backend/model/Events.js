import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    organizerID: {
        type: String,
        required: true
    },
    eventOrganizerName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    venueId:{
        type:String,
        required:true
    },
    faculty: {
        type: String,
        enum:["COMMERCE,ADMINISTRATION AND LAW","EDUCATION","ENGINEERING, SCIENCE AND AGRICULTURE","HUMANITIES AND SOCIAL SCIENCE","Other"],
        default: "Other"
    },
    StudyLevel: {
        type: String,
        enum: ["postgrad", "undergrad"],
        required:true
    }
}, { timestamps: true });
const Event = mongoose.model("Events", EventSchema);
export default Event;
