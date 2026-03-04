/*
!   createdTransaction Controller Use Case:
    * Jab koi Paisa bheje tho ustime ye sab check karna hai
    ! fromUserAccount to toUserAccount 
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
}