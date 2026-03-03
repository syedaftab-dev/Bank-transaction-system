const mongoose = require("mongoose");

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

const accountModel = mongoose.model("account",accountSchema);

module.exports = accountModel;