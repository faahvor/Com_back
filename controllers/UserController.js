// controllers/UserController.js
import nodemailer from "nodemailer";
import User from "../models/user.js";


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Use the email address from .env
    pass: process.env.GOOGLE_APP_PASSWORD, // Use the app-specific password from .env
  },
});

// Route for handling form submission
export const registerUser = async (req, res) => {

  const { firstName, lastName, email, heardFrom } = req.body;

  // Validate that required fields are present
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      message: 'First name, last name, and email are required fields.',
    });
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this email already exists. Please use a different email.',
      });
    }

    // Save user data to MongoDB
    const newUser = new User({ name: `${firstName} ${lastName}`, email, heardFrom });
    await newUser.save();

    // Email content to the website owner
    const ownerMailOptions = {
      from: `"GEMZ INNOVATION" <${process.env.EMAIL_USER}>`, 
      to: process.env.NOTIFICATION_EMAIL, 
      subject: 'New User Registration',
      text: `A new user has registered:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nHeard From: ${heardFrom}`,
    };

    // Email to the new user
    const userMailOptions = {
      from: `"GEMZ INNOVATION" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: 'Thank you for registering!',
      text: 'Thank you for registering with us. You will hear from us soon!',
    };

    // Send the email to the owner
    transporter.sendMail(ownerMailOptions, error => {
      if (error) {
        console.error('Error sending email to owner:', error);
        return res.status(500).json({ message: 'Error sending email to owner', error });
      }

      // Send the email to the user
      transporter.sendMail(userMailOptions, error => {
        if (error) {
          console.error('Error sending email to user:', error);
          return res.status(500).json({ message: 'Error sending email to user', error });
        }
        
        console.log('Confirmation email sent to user');
      });

      console.log('Email notification sent to owner');
    });

    res.status(201).json({ message: 'User registered successfully, emails sent.' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
