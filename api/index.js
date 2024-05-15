import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

configDotenv();
const app = express();

app.use(express.json())

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("database connected")
}).catch((error)=>{
    console.log("Connection failed")
})

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