import organizer from "../model/EventOrganizers.js";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Use TLS for port 587
    auth: {
        user: "7cf92e002@smtp-brevo.com",  // Your Sendinblue login
        pass: "KTfLR7UAGIYmV03C",  // Your Sendinblue password
    },
});
// Get all verified organizers
export const getOrganizer = async (req, res) => {
    const role = req.user.role;
    if (role === "Admin") {
        try {
            const organizers = await organizer.find({ isVerified: true });
            res.json(organizers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching organizer data', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'You are not authorized to access this resource' });
    }
}

// Get all unverified organizers
export const GetOrganizer = async (req, res) => {
    const role = req.user.role;
    if (role === "Admin") {
        try {
            const organizers = await organizer.find({ isVerified: false });
            res.json(organizers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching organizer data', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'You are not authorized to access this resource' });
    }
}

// Delete an organizer
export const deleteOrganizer = async (req, res) => {
    const id = req.params.id;
    const role = req.user.role;
    if (role === "Admin") {
        try {
            const user = await organizer.findById(id); // Await the promise here
            if (user) {
                const mailOptions = {
                    from: 'kamozozobaete@gmail.com', // Your email
                    to: user.email,  // Send the email to the organizer's email address
                    subject: "Your Organizer Account is Rejected",
                    text: `Hello ${user.name},\n\n Unfortunately, your account has not been verified. Please try to request again.`,
                    html: `<p>Hello ${user.name},</p><p>Your account has not been verified successfully. Please try to request again.</p>`, // HTML version
                };
                // Send the email
                await transporter.sendMail(mailOptions);

                // Delete the organizer
                await organizer.findByIdAndDelete(id);

                // Respond with success message
                res.status(200).json({ message: "Organizer has been rejected and an email has been sent." });
            } else {
                res.status(404).json({ message: "Organizer not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(401).json({ message: 'You are not authorized to access this resource' });
    }
}

// Accept an organizer
export const AcceptOrganizer = async (req, res) => {
    const id = req.params.id;
    const role = req.user.role;

    if (role === "Admin") {
        try {
            const user = await organizer.findById(id);
            if (user) {
                // Update organizer's Verified status to true
                await organizer.findByIdAndUpdate(id, { Verified: true });

                // Send the email with their credentials
                const link = `http://10.11.136.1873001/verify-email/${encodeURIComponent(user.email)}`;
                const mailOptions = {
                    from: 'kamozozobaete@gmail.com', // Your email
                    to: user.email,  // Send the email to the organizer's email address
                    subject: "Your Organizer Account has been accepted",
                    text: `Hello ${user.name},\n\nYour account has been created successfully. Please follow the link below to verify your email:\n\n${link}\n\nThen, enter the verification code sent to you: ${user.verificationCode}`,
                    html: `<p>Hello ${user.name},</p><p>Your account has been created successfully. Please <a href="${link}">click here</a> to verify your email, and then enter the verification code sent to you:</p><p><b>Verification Code:</b> ${user.verificationCode}</p>`,
                };

                // Send the email
                await transporter.sendMail(mailOptions);

                // Respond with success message
                res.status(200).json({ message: "Organizer has been accepted successfully and an email has been sent." });
            } else {
                res.status(404).json({ message: "Organizer not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(401).json({ message: 'You are not authorized to access this resource' });
    }
};
