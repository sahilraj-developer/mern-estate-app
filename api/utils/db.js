import mongoose from "mongoose";

const connectDB =async()=>{

     try{
        await mongoose.connect(process.env.MONGO)
        console.log("Database connected")

     }catch(error){
        console.log("Failed Database connection",error)
     }


}


export default connectDB;