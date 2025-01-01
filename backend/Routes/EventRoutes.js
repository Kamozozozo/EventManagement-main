import express from "express"
import {getEvents, getEvents1,postEvents,getEventById, deleteEvent, updateEvent, searchEvent,setReminders ,getAvailableVenues,getReminders,createVenues, UpdateVenue} from "../controllers/Events.js"
import protectedRoutes from "../Middlewares/protectedRoutes.js"
const  eventRoute = express.Router()
eventRoute.get("/Events",protectedRoutes,getEvents)
eventRoute.post("/Event",protectedRoutes,postEvents)
eventRoute.get("/Event/:id",getEventById)
eventRoute.delete("/Event/:id",protectedRoutes,deleteEvent)
eventRoute.put("/Event/:id",protectedRoutes,updateEvent)
eventRoute.get("/search",searchEvent)
eventRoute.post("/EventsBY",protectedRoutes,getEvents1)
//use middle protect route
eventRoute.post("/reminders/:id",protectedRoutes,setReminders)
eventRoute.get("/reminders",protectedRoutes,getReminders)
eventRoute.post("/booking",protectedRoutes,getAvailableVenues) 
eventRoute.post("/venues",createVenues)
eventRoute.put("/venue",UpdateVenue)


export default eventRoute