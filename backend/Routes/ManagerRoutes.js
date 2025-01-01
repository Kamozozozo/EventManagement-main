import express from "express"
const OrganizerRoutes =express.Router()
import { getOrganizer,deleteOrganizer,AcceptOrganizer ,GetOrganizer} from "../controllers/ManageOranizer.js"
import protectedRoutes from "../Middlewares/protectedRoutes.js"
import { signup } from "../controllers/auth.js"
OrganizerRoutes.get("/Organizer",protectedRoutes,getOrganizer)
OrganizerRoutes.delete("/Organizer/:id",protectedRoutes,deleteOrganizer)
OrganizerRoutes.post("/Organizer",protectedRoutes,signup)
OrganizerRoutes.delete("/RejectOrganizer/:id",protectedRoutes,deleteOrganizer)
OrganizerRoutes.put("/AcceptOrganizer/:id",protectedRoutes,AcceptOrganizer)
OrganizerRoutes.get("/GetOrganizer",protectedRoutes,GetOrganizer)
export default OrganizerRoutes