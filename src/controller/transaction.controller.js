/*
!   createdTransaction Controller Use Case:
    
   * Kisi user ne paisa bhejne ki request ki → server pe aake ye function step-by-step validation karta hai taaki duplicate transaction, invalid account, ya insufficient balance jaise issues na ho.


?  1. Validate the request body to ensure that all required fields are present and correctly formatted.
?  2. Vlidate Idempotency Key
?  3. check account status
?  4. Derive sender balance from ledger entries (check balance)
?  5. Create transaction with status PENDING
?  6. Create Debit ledger entry
?  7. create credit ledger entry
?  8. Mark transaction as COMPLETED
?  9. Commit MongoDB session
? 10. Send email notification
*/

const mongoose = require("mongoose");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");

async function createdTransactionController(req, res) {

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    // ! 1. Validate the request
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "FromAccount, toAccount, amount, and idempotencyKey are required",
        })
    }
    // ? check if accounts exits or nnot
    const fromUserAccount = await accountModel.findOne({_id: fromAccount});
    const toUserAccount = await accountModel.findOne({_id: toAccount});

    if(!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            message: "Invalid fromAccount or toAccount",
        })
    }

    //!  2. Validate Idempotency Key

    // if idempotnecy key is already exits in DB that means this is a duplicate request and we should return the existing transaction instead of creating a new one. This is crucial for preventing duplicate transactions
    const isTransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey,
    })

    if(isTransactionAlreadyExist){

        // this is transactio is already completed we got duplicate req
        if(isTransactionAlreadyExist.status === "COMPLETED"){
            return res.status(200).json({
                message: "Transaction already completed",
                transaction: isTransactionAlreadyExist,
            })
        }
        if(isTransactionAlreadyExist.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction is already in progress",
            })
        }
        if(isTransactionAlreadyExist.status === "FAILED"){
            return res.status(500).json({
                message: "Transaction failed previously, please try again",
            })
        }
        if(isTransactionAlreadyExist.status === "REVERSED"){
            return res.status(500).json({
                message: "Transaction was reversed previously, please contact support",
            })
        }
    }

    // ! 3. check account status
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "From account or to account is not active",
        })
    }

    // ! 4. Derive sender balance from ledger entries (check balance)
    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message: `Insufficient balance. curren balance is ${balance} and requested amount is ${amount}`,
        })
    }

    // ? steps 5,6,7,8 must work together if not no one has to work
    // ! 5. Create transaction with status PENDING
    const session = await transactionModel.startSession();
    session.startTransaction();
    
    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    });
    // ! 6. Create Debit(cut hue) ledger entry
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    }],{
        session, // to ensure 5,6,7,8,all works together or none
    
    })
    // what paise cutte par dusre main nai aye
    // paise received after 1000*100 ms
    await (()=>{
        return new Promise((resolve)=>setTimeout(resolve,1000*100)) // simulating delay in credit ledger entry creation to test idempotency key and transaction status
    })()

    // ! 7. create credit(received) ledger entry
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    }],{
        session, // to ensure 5,6,7,8,all works together or none
    })

    // ! 8. Mark transaction as COMPLETED
    transaction.status = "COMPLETED";
    await transaction.save({ session }); // save transaction with session to ensure 5,6,7,8,all works together or none


    // ! 9. Commit MongoDB session
    await session.commitTransaction();
    session.endSession();

    // ! 10. Send email notification
    // await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount._id);

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction,
    });

}

// ! Controller to create initial funds from system user (admin)
async function createInitialFundsController(req,res){
    const { toAccount, amount, idempotencyKey } = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "toAccount, amount, and idempotencyKey are required",
        })
    }

    // check if toAccount exists or not
    const toUserAccount = await accountModel.findOne({_id: toAccount});
    if(!toUserAccount){
        return res.status(404).json({
            message: "Invalid toAccount",
        })
    }
    // fromAccout is system account (bank) 
    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    })
    
    // what if system account is not created or deleted
    if(!fromUserAccount){
        return res.status(500).json({
            message: "System account not found, please contact support",
        })
    }

    // if both account exist create session
    const session = await mongoose.startSession();
    session.startTransaction();

    // making an transaction object
    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    });

    await transaction.save({ session });

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    }],{
        session,
    })
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    }],{
        session,
    })

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message: "Initial funds added successfully",
        transaction,
    });
}

module.exports = { 
    createdTransactionController,
    createInitialFundsController
};