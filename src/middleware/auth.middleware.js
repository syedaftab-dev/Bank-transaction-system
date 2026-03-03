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


module.exports = {
    authMiddleware 
};