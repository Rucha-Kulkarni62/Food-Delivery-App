import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

//login user
const loginUser = async (req,res) => {
    const {email,password} = req.body;

    const user = await userModel.findOne({email});
    try {
        const user = await userModel.findOne({email});
        if(!user)
        {
            res.json({success:false,message:"User does not exist"});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);

        //If the password doesnt match
        if(!isMatch)
        {
            return res.json({success:false,message:"Invalid credentials"});
        }

        //If the password matches generate a token
        const token = createToken(user._id);
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//generating token
const createToken = (id) => {
   return jwt.sign({id},process.env.JWT_SECRET);
}

//register user
const registerUser = async (req,res) => {
     const {name,password,email} = req.body;
     try {
        //Check if the user already exists
        const exist = await userModel.findOne({email});
        if(exist)
        {
            return res.json({success:false, message:"User already exists"});
        }

        //validating email format and strong password
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:"Enter a valid email"});
        }

        if(password.length < 8)
        { 
            return res.json({success:false,message:"Enter a strong password"});
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //Creating a new user
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

       const user =  await newUser.save();
       const token = createToken(user._id);
       res.json({success:true,token});

     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
     }
}

export{loginUser,registerUser};