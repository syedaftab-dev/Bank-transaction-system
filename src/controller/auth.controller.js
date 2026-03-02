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
        
        // Save user to database
        await user.save();
        
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

// ! User login Controller - post /api/auth/login
async function userLoginController(req,res){
    try {
        const {email,password} = req.body;

        const user = await userModel.findOne({email}).select("+password"); // select password because in schema we set select: false for password field otherwise it will return undefined and we can't compare password in login controller

        if(!user){
            return res.status(401).json({message: "Invalid email or password", status: "failed"});
        }

        const isValidPassword = await user.comparePassword(password);

        if(!isValidPassword){
            return res.status(401).json({message: "Invalid email or password", status: "failed"});
        }

        // if password is corect make a token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"3d"});

            // ! set cookie and make it secure in production
            res.cookie("token", token,{
                maxAge: 3*24*60*60*1000,
                httpsOnly: true, // prevent XSS attack
                sameSite: "strict", // prevent CSRF attacks
                // secure: process.env.NODE_ENV === "production"
            });

            res.status(200).json({
                user:{
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                token,
                message: "User logged in successfully",
                status: "success"
            })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message });
    }
}

module.exports = {
    userRegisterController
    ,userLoginController
}


