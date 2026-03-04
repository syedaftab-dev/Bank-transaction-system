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


// ! 
async function getUserAccountsController(req,res){

    const accounts = await accountModel.find({user: req.user._id});

    res.status(200).json({
        accounts
    })
}


// ! get account balance controller
async function getAccountBalanceController(req,res){
    const {accountId} = req.params; // will get account id from params(url of browser) 

    const account = await accountModel.findOne({_id: accountId, user: req.user._id}); // find the account with the given id and belongs to the authenticated user

    // if account not found then return 404
    if(!account){
        return res.status(404).json({
            success: false,
            message: "Account not found"
        })
    }

    // we created balance method in account model to get the balance of the account
    const balance = await account.getBalance();

    res.status(200).json({
        accountId: accountId,
        balance,
    })

}


module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}