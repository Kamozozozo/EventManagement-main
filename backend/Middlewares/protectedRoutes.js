import jwt from "jsonwebtoken";
import organizer from "../model/EventOrganizers.js";
import students from "../model/Students.js";
import admin from "../model/admin.js";

const protectedRoutes = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Retrieve the token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const secretKey = process.env.JWT_SECRET; // Fetch the secret key from environment variables
        if (!secretKey) {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }

        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Try to find the user in the different collections
        let user = await students.findById(decoded.userId).select("-password"); // Check Students collection

        if (!user) {
            user = await organizer.findById(decoded.userId).select("-password"); // Check EventOrganizers collection
        }

        if (!user) {
            user = await admin.findById(decoded.userId).select("-password"); // Check Admin collection
        }

        // If no user is found in any collection
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Attach the user to the request object for use in next middleware or route handler
        req.user = user;
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error); // Log error details
        res.status(401).json({ message: "Unauthorized: Something went wrong" });
    }
};

export default protectedRoutes;
