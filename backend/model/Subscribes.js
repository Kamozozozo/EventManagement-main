import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId:String, // Reference to the User model
    subscription: {
        endpoint: { type: String,  },
        expirationTime: { type: Date }, // optional
        keys: {
            p256dh: { type: String, },
            auth: { type: String,  },
        },
    },
    faculty: { type: String, required: true },
    StudyLevel: { type: String, required: true },
}, { timestamps: true }); 

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
