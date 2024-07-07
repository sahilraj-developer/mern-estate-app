import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import connectDB from './utils/db.js'
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';

configDotenv();
const app = express();
app.use(cookieParser());
app.use((req, res, next) => {
    // console.log('Cookies:', req.cookies);
    next();
});
connectDB();
app.use(express.json())
app.use(cors())

const __dirname = path.resolve();

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

app.listen(3001,()=>{
    console.log("server is runnign at port 3001")
})