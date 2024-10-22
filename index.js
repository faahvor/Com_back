import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/conn.js"
import { registerUser } from "./controllers/UserController.js"


dotenv.config()
connectDB()

const app = express()
 const port = "5000"
 app.use(express.json())
app.use(cors())
app.post('/api/register', registerUser);

 app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
 })