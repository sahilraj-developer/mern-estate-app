import { errorHandler } from "../utils/error.js"
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'

export const test = (req,res)=>{
    res.json({
        message:"Api Route is working"
    })
}

export const updateUser = async(req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can Only update your own account"))
        try{
    if(req.body.password){
        const hashPassword=await bcrypt.hash(req.body.password,10) 
      }

      const updateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
           username: req.body.username,
           email:req.body.email,
           password:req.body.password,
           avatar:req.body.avatar,
        }
      },{new:true})

      const {password,...rest} = updateUser._doc

      res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}