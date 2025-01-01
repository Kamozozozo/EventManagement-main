import event from "../model/Events.js"
import reminder from "../model/Reminder.js"
import Venue from "../model/Venue.js"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import Subscription from "../model/Subscribes.js"
import pkg from "web-push"
import webPush from "web-push"
const  { setVapidDetails }=pkg
import { io } from "../socket.js"


dayjs.extend(duration);

const publicVapidKey = 'BO4lq1bZSvVXYK3r612qFIHOSyKORELeRIV68orwNQadptewncS80dYjanob-xkjBVxbH2z-_-VgMSZlC8ER_9s';
const privateVapidKey = 'LtDqxhjk9gQnmrAF8JvPpqmo93DiCgH4S_jCF3HyL6I';
setVapidDetails('mailto:kamozozobaete@example.com', publicVapidKey, privateVapidKey);
export const getEvents = async (req, res) => {
    const requesterId = req.user._id;
    const role = req.user.role;
    const facultys = req.user.faculty;
    const requesterLevel = req.user.StudyLevel;
    const today = new Date();
    console.log("Faculty:", facultys);
    console.log("Requester Level:", requesterLevel);
    console.log("Role:", role);
    try {
        // Admin: Get all events except those with "Other" faculty
        if (role === "Admin") {
            const events = await event.find({
                eventDate:{$gte:today},
                faculty: { $ne: "Other" },
            },  {
                image: 0, // Exclude the 'picture' field from the result
            }).sort({ 
                createdAt: -1 });
            res.status(200).json(events);
        }
        // Organizer: Get events posted by this organizer
        else if (role ==="Organizer") {
            const events = await event.find({
                eventDate:{$gte:today},
                faculty: { $ne: "Other" },
                organizerID:requesterId
            },  {
                image: 0, // Exclude the 'picture' field from the result
            }
            
        ).sort({ 
            createdAt: -1 });;
            res.status(200).json(events);
        }
        // Student: Get events based on the student's faculty
        else if (role === "Student") {
            const events = await event.find(
                {
                    faculty: facultys,
                    eventDate:{$gte:today},
                    StudyLevel:requesterLevel

                  },  {
                    image: 0, // Exclude the 'picture' field from the result
                }
            ).sort({ 
                createdAt: -1 });
            res.status(200).json(events);
        } else {
            res.status(403).json({ message: "Unauthorized role" });
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Internal server error, please try again later" });
    }
};

export const getEvents1 = async (req, res) => {
    const { other } = req.body;
    const requesterRole = req.user.role;
    const requesterId = req.user._id;
    const requestFaculty = req.user.faculty;
    const requesterLevel = req.user.StudyLevel;
    const today = new Date();
    console.log(today)
    console.log(other)

    try {
        // Admin handling
        if (requesterRole === "Admin") {
            if (other === "Other") {
                const events = await event.find({
                    faculty: other,
                    eventDate:{$gte:today},
                }).sort({ 
                    createdAt: -1 });
                res.status(200).json(events);
            } else if (other === "Past") {
                const events = await event.find({
                    eventDate: { $lt: today },
                }).sort({ 
                    createdAt: -1 });
                res.status(200).json(events);
            }
        }
        // Organizer handling
        else if (requesterRole === "Organizer") {
            if (other === "Other") {
                const events = await event.find({
                    organizerID: requesterId,
                    faculty: other,
                    eventDate:{$gt:today}
                },  {
                    image: 0, // Exclude the 'picture' field from the result
                }).sort({ 
                    createdAt: -1 });
                res.status(200).json(events);
            } else if (other === "Past") {
                const events = await event.find({
                    eventDate: { $lte: today },
                    organizerID: requesterId,
                },  {
                    image: 0, // Exclude the 'picture' field from the result
                });
                res.status(200).json(events);
            }
        }
        // Student handling
        else if (requesterRole === "Student") {
            if (other === "Other") {
                const events = await event.find(
                    {
                        faculty: other,
                        StudyLevel:requesterLevel,
                        eventDate: { $gt: today }
                      },  {
                        image: 0, // Exclude the 'picture' field from the result
                    }
                ).sort({ 
                    createdAt: -1 });
                res.status(200).json(events);
            } else if (other === "Past") {
                const events = await event.find({
                    eventDate: { $lte: today },

                },  {
                    image: 0, // Exclude the 'picture' field from the result
                }).sort({ 
                    createdAt: -1 });
                res.status(200).json(events);
            }
        } else {
            res.status(403).json({ message: "Unauthorized role" });
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Internal server error, please try again later" });
    }
};

export const createVenues = async (req,res)=> {
    const {name,status,capacity,startDate,endDate}=req.body
    try{

        const venue = new Venue({
            name,
            status,
            capacity,
            startDate,
            endDate
            });
            await venue.save();
            res.status(201).json({
                _id:venue._id,
                name:venue.name,
                status:venue.status,
                startDate:venue.startDate,
                endDate:venue.endDate
            });            
    }catch(error){ 
        res.status(500).json({message:"internal server error please again later"})
    }
}
export const postEvents = async (req, res) => {
    const eventOrganizerName = req.user.name;
    const organizerID = req.user._id;
    const { eventName, eventDescription, eventDate, venue, venueId, image, faculty, StudyLevel } = req.body;
    console.log(eventName, eventDescription, eventDate, venue, venueId, image, faculty, StudyLevel)
    try {
        // Update the status of the venue
        const venueUpdate = await Venue.findByIdAndUpdate(
            venueId,  // Pass the correct venueId
            { $set: { status: 'inactive' } },
            { new: true }  // Return the updated document
        );

        if (!venueUpdate) {
            return res.status(404).json({ message: "Venue not found" });
        }
        const InvalidVenue=await Venue.findById(
            venueId,
        
        )
        if (InvalidVenue.status !=='inactive'){
            return res.status(404).json({ message: "Venue Has been taken please choose another venue" });
        }else{
               // Create the new event
        const newEvent = new event({
            eventName,
            eventOrganizerName,
            organizerID,
            eventDescription,
            eventDate,
            venue,
            venueId,
            image,
            faculty,
            StudyLevel
        });
        await newEvent.save();
         // Fetch students matching the event's faculty and study level
         const subscriptions = await Subscription.find({
            faculty,
            StudyLevel
        });
        console.log(subscriptions)
        // Prepare the payload for notifications
        const payload = JSON.stringify({
            title: "New Event",
            body: `An event ${eventName} has been scheduled.`,
            data: {
                eventId: newEvent._id,
                faculty,
                StudyLevel
            }
        });

        // Send the notifications
        subscriptions.forEach(subscription => {
            webPush.sendNotification(subscription.subscription, payload).catch(error => console.error(error));
        });


        // Respond with success and event details
        res.status(201).json({
            message: "Event created successfully",
            _id: newEvent._id,
            eventName: newEvent.eventName,
            eventOrganizerName: newEvent.eventOrganizerName,
            eventDescription: newEvent.eventDescription,
            eventDate: newEvent.eventDate,
            venue: newEvent.venue,
            venueId: newEvent.venueId,
            image: newEvent.image,
            faculty: newEvent.faculty,
            StudyLevel: newEvent.StudyLevel
        })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getEventById= async (req,res)=>{
        const id = req.params.id;
        try {
          const events = await event.findById(id);
          if (!events) {
            return res.status(404).json({ message: "event not found" });
          }
      
          return res.status(200).json(events);
        } catch (error) {
          return res.status(500).json({ message: "Server error, please try again later" });
        }
}
export const updateEvent = async(req, res)=>{
    const role=req.user.role
    const { eventName, eventDescription, eventDate, venue, venueId, image, faculty, StudyLevel } = req.body;
    if(role!="Student"){
        try{
            const {id} = req.params;
            const eventAdded = await event.findByIdAndUpdate(id,
                {   
                    eventName,
                    eventDescription,
                    eventDate,
                    venue,
                    venueId,
                    image,
                    faculty,
                    StudyLevel
                }
            );
            // we cannot find any event in database
            if(!eventAdded){
                return res.status(404).json({message:`cannot find any event with id ${id}`})
            }
            return res.status(200).json({message:`event with id ${id} has been updated`})
            const updatedEvent = await event.findById(id);
            res.status(200).json(updatedEvent);
        }catch (error){
            res.status(500).json({message:error.message})
        }

    }
    else{
        res.status(403).json({message:"You are not authorized to perform this action"})
    }
 }
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;  // Event ID from request parameters
        const requesterId = req.user._id;
        const currentUser = req.user.role;

        // Find the event to delete
        const eventToDelete = await event.findById(id);

        if (!eventToDelete) {
            return res.status(404).json({ message: `Event with ID ${id} not found` });
        }

        // Check user role and authorization
        if (currentUser === "Student") {
            return res.status(403).json({ message: "You are not authorized to delete an event" });
        } else if (currentUser == "Organizer" && requesterId == eventToDelete.organizerID) {
            // Organizer can delete their own event
            const eventDel = await event.findByIdAndDelete(id);
            console.log("venueId ",eventDel.venueId)

            if (!eventDel) {
                return res.status(404).json({ message: `Cannot find any event with ID ${id}` });
            }

            // Update venue status to 'active' after event is deleted
            const venueId = eventDel.venueId;  // Assume venueId is stored on the event document
            const venueUpdate = await Venue.findByIdAndUpdate(
                venueId,  // Use the ObjectId directly
                { $set: { status: 'active' } },  // Update status to 'active'
                { new: true }  // Return the updated document
            );

            if (!venueUpdate) {
                return res.status(404).json({ message: `Cannot find venue with ID ${venueId}` });
            }

            return res.status(200).json({ message: 'Event successfully deleted and venue status updated' });
        } else if (currentUser === "Admin") {
            // Admin can delete any event
            const eventDel = await event.findByIdAndDelete(id);

            if (!eventDel) {
                return res.status(404).json({ message: `Cannot find any event with ID ${id}` });
            }

            // Update venue status to 'active' after event is deleted
            const venueId = eventDel.venueId;
            const venueUpdate = await Venue.findByIdAndUpdate(
                venueId,
                { $set: { status: 'active' } },
                { new: true }
            );

            if (!venueUpdate) {
                return res.status(404).json({ message: `Cannot find venue with ID ${venueId}` });
            }

            return res.status(200).json({ message: 'Event successfully deleted and venue status updated' });
        } else {
            return res.status(403).json({ message: "You are not authorized to delete this event" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const searchEvent=async(req,res)=>{
    try {
        const { eventName, date, faculty } = req.query;
        let query = {};

        if (eventName) {
            query.eventName = { $regex: eventName, $options: 'i' }; // Case-insensitive search
        }

        if (date) {
            query.date = new Date(date);
        }

        if (faculty) {
            query.faculty = { $regex: faculty, $options: 'i' }; // Case-insensitive search
        }

        const events = await event.find(query, {
            image: 0, // Exclude the 'picture' field from the result
        });
        if(events.length>0){
        res.status(200).json(events);
        }else{
            res.status(400).json({message:' no event found'})
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error, please try again later" });  
    }
}
export const setReminders = async (req, res) => {
    const { id } = req.params; // Event ID from URL params
    const UserId = req.user._id; // User ID from auth middleware
    const { time } = req.body; // Reminder time from request body, e.g., '5m', '15m'

    // Time mappings for reminder subtraction
    const timeMapping = {
        '5m': dayjs.duration(5, 'minutes'),
        '15m': dayjs.duration(15, 'minutes'),
        '30m': dayjs.duration(30, 'minutes'),
        '1h': dayjs.duration(1, 'hours'),
        '2h': dayjs.duration(2, 'hours'),
        '3h': dayjs.duration(3, 'hours'),
        '4h': dayjs.duration(4, 'hours'),
    };

    try {
        // Check if a reminder for this event and user already exists
        const eventReminder = await reminder.findOne({ eventID: id, userID: UserId });
        if (eventReminder) {
            return res.status(200).json({ message: "Reminder already exists" });
        }

        // Get event details from the database
        const getEventData = await event.findOne({ _id: id });
        if (!getEventData) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Extract event time and calculate the reminder time
        const eventTimeDate = dayjs(getEventData.eventDate.toLocaleString('en-US', { timeZone: 'UTC' })); // Assuming `getEventData.date` is an ISO string or Date object
      
            // Extract the date in 'YYYY-MM-DD' format
            const date = eventTimeDate.format('YYYY-MM-DD');
            console.log(date)

            // Extract the time in 'HH:mm A' format (12-hour format with AM/PM)
    

        const reminderDuration = timeMapping[time];
        console.log(reminderDuration)

        // Validate the reminder duration
        if (!reminderDuration) {
            return res.status(400).json({ message: "Invalid reminder time" });
        }

     
        const reminderTriggerTime = eventTimeDate.subtract(reminderDuration).toDate();
        const reminderTime = dayjs(reminderTriggerTime).format('hh:mm A');
       

        // Save the new reminder to the database
        const reminderD = new reminder({
            eventID: id,
            userID: UserId,
            eventName: getEventData.eventName,
            eventDate: date,
            time: reminderTime,
            venue:getEventData.venue
        });

        // Save reminder to database
        await reminderD.save();

        // Send success response
        res.status(200).json({ message: "Reminder set successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
export const PushReminder = async (req, res) => {
    const currentDateTime = dayjs(); // Get the current date and time

    try {
        const reminders = await reminder.find();

        for (const reminder of reminders) {
            // Construct the reminder trigger time
            const reminderTriggerTime = dayjs(`${reminder.eventDate} ${reminder.time}`, "YYYY-MM-DD hh:mm A");

            // Check if the current time is exactly the reminder time (down to the minute)
            const isTimeToSend = reminderTriggerTime.isSame(currentDateTime, 'minute'); // Check only up to the minute

            // Check if the reminder date is today
            const isSameDate = reminderTriggerTime.isSame(currentDateTime, 'day');

            // Send the notification if both date and time match
            if (isTimeToSend && isSameDate) {
                const userSubscription = await Subscription.findOne({ userId: reminder.userID });

                if (userSubscription) {
                    const payload = JSON.stringify({
                        title: `Reminder: ${reminder.eventName}`,
                        body: `Event at ${reminder.venue} is starting soon at ${reminder.time}.`,
                    });

                    // Send the notification
                    try {
                        await webPush.sendNotification(userSubscription.subscription, payload);
                        console.log(`Notification sent for event ${reminder.eventName} to user ${reminder.userID}`);
                    } catch (error) {
                        console.error("Error sending notification:", error.message);
                    }
                }

                // Optionally, delete the reminder to avoid sending it multiple times
                await reminder.deleteOne({ _id: reminder._id });
            }
        }

    } catch (error) {
        console.error("Error processing push reminders:", error.message);   
    }
};
export const getReminders = async (req, res) => {
    const userId = req.user._id; 

    try {
        const reminders = await reminder.find({userID:userId });

        if (!reminders || reminders.length === 0) {
            return res.status(404).json({ message: "No reminders found for this user." });
        }
        // Respond with the retrieved reminders
        res.json(reminders);
    } catch (error) {
      
    }
};
export const getAvailableVenues = async (req, res) => {
    const { date } = req.body;
    const role = req.user.role;
  
    // Check if the user is authorized
    if (role !== "Organizer") {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
  
    // Check if date is provided
    if (!date) {
      return res.status(400).json({ message: "Please provide a valid date." });
    }
    try {
      // Parse the date and create a range for the entire day
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0); // Start of the day in UTC
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999); // End of the day in UTC
  
      // Fetch venues with active status and available for the given date
      const venues = await Venue.find({
        status: "active",
        startDate: { $gte: startOfDay, $lte: endOfDay }
      });
  
      // Send response
      res.status(200).json(venues);
    } catch (error) {
      console.error("Error fetching available venues:", error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  };
export const UpdateVenue = async (req, res) => {
    const { venueToChange } = req.body;
  
    try {
      const venue = await Venue.findByIdAndUpdate(
        venueToChange,
        { $set: { status: 'active' } },  // Update status to 'active'
        { new: true }  // Return the updated document
      );
  
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
  
      res.status(200).json({
        message: "Venue status updated to active. Please proceed."
      });
    } catch (error) {
      console.error('Error updating venue:', error);
      res.status(500).json({ message: "Unable to change venue", error: error.message });
    }
  };
  
export const updateVenueStatus = async () => {
    try {
        const currentTime = new Date();
        const venuesToUpdate = await Venue.find({
            status: "inactive",
            //to be checked
       
        });
        console.log("Venues to update:", venuesToUpdate); // Check what is returned

        // Exit if there are no venues to update
        if (venuesToUpdate.length === 0) {
            console.log("No venues to update."); // No venues found
            return;
        }

        // Update the status of each venue to 'active'
        for (let venue of venuesToUpdate) {
            if(venue.endDate < currentTime){
                venue.status = "active"; // Change status to active
                await venue.save();
                console.log(`Updated venue ${venue._id} to active.`); // Log the update
            }
        }
        console.log("Venue statuses updated successfully.");
    } catch (error) {
        console.error("Error updating venue statuses:", error.message);
    }
};
// Run the function every minute
///setInterval(updateVenueStatus, 50 * 1000);
let reminderInterval;
let isProcessing = false; 

const startReminderCheck = () => {
    reminderInterval = setInterval(async () => {
        if (!isProcessing) { 
            isProcessing = true; 
            try {
                await PushReminder(); 
            } catch (error) {
                console.error("Error during reminder check:", error.message);
            } finally {
                isProcessing = false;
            }
        }
    }, 5 * 1000); 
};

// Call this function to start the interval
startReminderCheck()

