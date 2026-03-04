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

const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");

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
    
    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    },{
        session, // to ensure 5,6,7,8,all works together or none
    });
    // ! 6. Create Debit(Received) ledger entry
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    },{
        session, // to ensure 5,6,7,8,all works together or none
    
    })
    // ! 7. create credit(cut howe) ledger entry
    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    },{
        session, // to ensure 5,6,7,8,all works together or none
    })

    // ! 8. Mark transaction as COMPLETED
    transaction.status = "COMPLETED";
    await transaction.save({ session }); // save transaction with session to ensure 5,6,7,8,all works together or none


    // ! 9. Commit MongoDB session
    await session.commitTransaction();
    session.endSession();

    // ! 10. Send email notification
    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount._id);

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction,
    });

}

module.exports = { createdTransactionController };