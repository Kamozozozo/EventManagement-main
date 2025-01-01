import jwt from "jsonwebtoken"

const generateTokenAndSetCode = (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        
        res.cookie("jwt", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to `true` in production
        });
    } catch (error) {
        console.error("Error generating token:", error);
    }
};

export default generateTokenAndSetCode;
