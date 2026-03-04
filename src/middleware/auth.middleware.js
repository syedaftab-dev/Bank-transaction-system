const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ! Middleware to protect routes and check if user is authenticated
async function authMiddleware(req,res,next){
    try{
        // ? Get token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message: "Unauthorized access, token is missing"
            })
        }

        try{
            // ? Verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET); // we will get user id from token
            
            const user = await userModel.findById(decoded.userId);

            req.user = user; // attach user to request object

            return next(); 
        }
        catch(err){
            return res.status(401).json({
                message: "Unauthorized access, invalid token"
            })
        }
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}


// ! Middleware to check if user is system user for creating initial funds
async function authSystemUserMiddleware(req,res,next){

    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message: "Unauthorized access, token is missing"
            })
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decode.userId).select("+systemUser");

        // only ssytem user (admin) can access futher
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, only system user can perform this action aauth"
            })
        }
        req.user = user; // attach user to request object
        return next()
    }   
    catch(err){
        return res.status(401).json({
            message: "Unauthorized access, invalid token"
        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}