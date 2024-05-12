import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv()
const app = express();



mongoose.connect(process.env.MONGO).then(()=>{
    console.log("database connected")
}).catch((error)=>{
    console.log("Connection failed")
})

app.listen(3000,()=>{
    console.log("server is runnign at port 3000")
})