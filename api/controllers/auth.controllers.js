import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { errorHandler } from '../utils/error.js';
import JWT from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashedPassword =await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
      "api hit here"
      await newUser.save();
      res.status(201).json('User created successfully!');
    } catch (error) {
      next(error);
    }
  };


  export const signin =async(req,res,next)=>{

    const {email,password} =req.body
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found"));
    
    try {
        const isPasswordValid = await bcrypt.compare(password, validUser.password);
        if (!isPasswordValid) return next(errorHandler(401, "Invalid Password"));
    } catch (err) {
        return next(errorHandler(500, "Error comparing passwords"));
    }
    
    let token;
    try {
        token = JWT.sign({ id: validUser._id }, process.env.JWT_SECRET);
    } catch (err) {
        return next(errorHandler(500, "Error generating token"));
    }
    
    try {
      const {password:pass, ...rest} = validUser._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire in 24 hours
        }).status(200).json(rest);
    } catch (err) {
        return next(errorHandler(500, "Error setting cookie"));
    }
    

  }

  export const google = async(req,res,next)=>{
    try{
      const user = await User.findOne({email:req.body.email})
      if(user){
        const token = JWT.sign({id:user._id}, process.env.JWT_SECRET);
        const {password:pass, ...rest} = user._doc;
        res.
        cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest);
      }else{
        const generatePassword = Math.random().toString(36).slice(-8)+ Math.random().toString(36).slice(-8);
         const hashedPassword =await bcrypt.hash(generatePassword, 10);
         const newUser = new User({username:req.body.name?.split(" ").join("").toLowerCase()+
         Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo});

         await newUser.save();

         const token = JWT.sign({id:newUser._id},process.env.JWT_SECRET);
         res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)

      }

    }catch(error){
      next(error)
    }

  }