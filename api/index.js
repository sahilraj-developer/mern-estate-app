import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import connectDB from './utils/db.js'

configDotenv();
const app = express();

connectDB();
app.use(express.json())

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);

app.use((err,req,res) =>{
    const statusCode = err.statusCode || 500;

    const message = err.message || "internal Server Error";

    return res.status(statusCode).json({
        success:true,
        statusCode,
        message,
    });
});

app.listen(3000,()=>{
    console.log("server is runnign at port 3000")
})