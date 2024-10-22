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
  const { name, email, companyName, message } = req.body;

  // Validate that required fields are present
  if (!name || !companyName) {
    return res.status(400).json({
      message: 'Name and Company Name are required fields.',
    });
  }

  try {
    // Check if a user with the same name or company name already exists
    const existingUser = await User.findOne({
      $or: [{ name }, { companyName }],
    });

    if (existingUser) {
      // If a duplicate is found, return an error message
      return res.status(400).json({
        message: 'A user with this name and company name already exists. Please use a different name or company name.',
      });
    }

    // Save user data to MongoDB
    const newUser = new User({ name, email, companyName, message });
    await newUser.save();

    // Send an email notification
    const mailOptions = {
      from: `"GEMZ INNOVATION" <${process.env.EMAIL_USER}>`, // Displayed sender name and email
      to: process.env.NOTIFICATION_EMAIL, // Email that will receive the registration notification
      subject: 'New User Registration',
      text: `A new user has registered: \n\nName: ${name}\nEmail: ${email}\nCompany: ${companyName}\nMessage: ${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error });
      }
      console.log('Email sent:', info.response);
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
