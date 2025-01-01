import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive']
  },
  capacity: {
    type: Number,
    required: true
  },
    startDate: {
      type: Date,
      required: true,
      unique:true
      
   
    },
    endDate: {
      type: Date,
      required: true,
      unique:true

    }
  
});

// Creating a unique compound index for time fields if necessary
VenueSchema.index({ "time.start": 1, "time.endDate": 1});
const Venue = mongoose.model("Venues", VenueSchema);
export default Venue;
