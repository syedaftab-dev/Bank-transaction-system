const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ! User register Controller - post /api/auth/register
async function userRegisterController(req,res){
    try {
        const {name,email,password} = req.body;

        if(!email || !password || !name){
            return res.status(400).json({ message: "All fields are required! "});
        }
        // ? email validation did already in schema file 
        // * Validation of email
        const emailExist = await userModel.findOne({email:email});
        if(emailExist){
            return res.status(400).json(
                {message:"Email already exist", status: "failed"});
        }
        // * Create new user
        const user = new userModel({
            email,
            password,
            name
        })
        
        // create token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"3d"});

        // ! set cookie and make it secure in production
        res.cookie("token", token,{
            maxAge: 3*24*60*60*1000,
            httpsOnly: true, // prevent XSS attack
            sameSite: "strict", // prevent CSRF attacks
            // secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            },
            token,
            message: "User created successfully",
            status: "success"
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message });
    }
}

module.exports = {
    userRegisterController
}