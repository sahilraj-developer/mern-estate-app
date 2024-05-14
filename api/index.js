import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userRouter from './routes/user.route.js';

configDotenv()
const app = express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("database connected")
}).catch((error)=>{
    console.log("Connection failed")
})


app.use('/api/user',userRouter)

app.listen(3000,()=>{
    console.log("server is runnign at port 3000")
})