// models/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    
    trim: true,
  },
  lastName: {
    type: String,
    
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true, // Ensures the email is unique in the database
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Validates email format
  },
  heardFrom: {
    type: String,
    required: [true, 'Information about how you heard about us is required'],
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
