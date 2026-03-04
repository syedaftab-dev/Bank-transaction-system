const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "From account is required"],
        index: true, // create an index on fromAccount for faster queries
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "To account is required"],
        index: true, // create an index on toAccount for faster queries 
    },
    status:{
        type: String,
        enum:{
            values: ["PENDING","COMPLETED","FAILED","REVERSED"],
            message: "Status must be either PENDING, COMPLETED, FAILED, or REVERSED",
        },
        default: "PENDING"
    },
    amount:{
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be a positive number"]
    },
    // ! to track the transaction history and ensure idempotency, we will use a unique idempotency key for each transaction request. This will help us to prevent duplicate transactions in case of network issues or retries.
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required"],
        unique: true, // ensure
        index: true, // create an index on idempotencyKey for faster queries
    }
},{
    timestamps: true
})