const accountModel = require("../models/account.model");


// ! Controller function to create a new account for authenticated user
async function createAccountController(req,res){
    try{
        const user = req.user; // we will get user from auth middleware

        const account = await accountModel.create({
            user: user._id,
        })

        res.status(201).json({
            message: "Account created successfully",
            account
        })     
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createAccountController

}