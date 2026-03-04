const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Account is required"],
        index: true, // create an index on account for faster queries
        immutable: true, // once set, account reference cannot be changed
    },
    amount:{
        type: Number,
        required: [true, "Amount is required"],
        immutable: true, // once set, amount cannot be changed
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Transaction is required"],
        index: true, // create an index on transaction for faster queries
        immutable: true, // once set, transaction reference cannot be changed
    },
    type:{
        type: String,
        enum:{
            values: ["DEBIT","CREDIT"],
            message: "Type must be either DEBIT or CREDIT",
        },
        required: [true, "Type is required"],
        immutable: true, // once set, type cannot be changed
    }
},{
    timestamps: true
})

function preventLeadgerModification(next){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

// ! We will use Mongoose middleware to prevent any updates or deletions on ledger entries, ensuring immutability and integrity of financial records. This is crucial for maintaining accurate transaction history and preventing tampering with financial data.
ledgerSchema.pre("updateOne", preventLeadgerModification);
ledgerSchema.pre("deleteOne", preventLeadgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLeadgerModification);
ledgerSchema.pre("remove", preventLeadgerModification);
ledgerSchema.pre("deleteMany", preventLeadgerModification);

const ledgerModel = mongoose.model("ledger",ledgerSchema);

module.exports = ledgerModel;
    