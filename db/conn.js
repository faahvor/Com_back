import mongoose from "mongoose"
import {config} from "dotenv"

config()
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.ATLAS_URI)
        console.log("Database connected successfully");
        console.log("ATLAS_URI:", process.env.ATLAS_URI);
 
        return mongoose.connection;
    } catch(error){
        console.log("Error while connecting to database",error);
    }
  };
  
  export default connectDB;