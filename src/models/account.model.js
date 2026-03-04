const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",

        required: [true,"User is required for creating an account"],
        index: true, // create an index on user field for faster queries (B+ tree index)
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE","FROZEN","CLOSED"],
            message: "Status must be either ACTIVE, FROZEN, or CLOSED",
        },
        default: "ACTIVE"
    },
   currency: {
    type: String,
    default: "INR",
    required: [true, "Currency is required"],
   }
},{
    timestamps: true
})

accountSchema.index({ user: 1,status: 1}); 
// * “User aur status ke combination pe ek index bana do. user + status ”
// ? EX - Account.find({ user: "U123", status: "ACTIVE" }); without index it will scan all accounts, with index it will directly go to the relevant entries, improving performance significantly. This is called as Compound index

// ! to get balance of an accouunt from ledger instead storing it separalty
// creating getBalance function in account Schema, always use normal funciton dont use arrow
accountSchema.methods.getBalance = async function(){
    // we will calculate the balance by summing up all the ledger entries for this account.
    
    
    // aggregate(array) - to run custom query in DB(ledgerModel)
    const balanceData = await ledgerModel.aggregate([
        {$match: { account: this._id }}, // match all ledger entries for this account
        {
            $group:{
                _id: null,
                totalDebit: {
                    $sum:{
                        $cond:[
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum:{
                        $cond:[
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            
            }
        },
        { // calculate balance by subtracting total debit from total credit
            $project:{
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ])
    // if user is new then itss ledger entry will be emtpy

    if(balanceData.length === 0){
        return 0;
    }
    return balanceData[0].balance;
}
const accountModel = mongoose.model("account",accountSchema);

module.exports = accountModel;