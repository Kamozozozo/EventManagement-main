
import router from './Routes/auth.js'
import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import connection from './db/DbConnection.js'
import eventRoute from "./Routes/EventRoutes.js"
import OrganizerRoutes from "./Routes/ManagerRoutes.js"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import {app,io,server} from "./socket.js"
import { bodyPaser } from './Middlewares/saveImages.js'
dotenv.config();
app.use(cookieParser())
app.use(cors({
    origin: ['http://10.11.136.187:3001', "https://event-management.onrender.com"],
    
    credentials: true
}))

app.use(bodyPaser)

app.use(bodyParser.json({ limit: '50mb' }));  
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
//app.use(bodyParser.json({ limit: '10mb' }));
//app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
const PORT = 3000
app.use("/api/auth",router)
app.use("/api/events",eventRoute)
app.use("/api/ManageOrganizer",OrganizerRoutes)
server.listen(PORT,"10.11.136.187",()=>{
    connection()
    console.log(`Server is running on port ${PORT}`)
})
