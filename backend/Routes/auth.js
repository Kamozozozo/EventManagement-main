import express from 'express'
import { login,logout,signup,addStudent,subscribe,verifyEmail } from '../controllers/auth.js'
import protectedRoutes from "../Middlewares/protectedRoutes.js"
const router = express.Router()
router.post("/login",login)
router.post("/signup",signup)
router.post("/signupSTudents",addStudent)
router.post("/subscribe",protectedRoutes,subscribe)
router.post("/verifyEmail",verifyEmail)
router.post("/logout",logout)



export default router;
