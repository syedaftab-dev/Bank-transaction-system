const mongoose = require("mongoose");


const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: [true,"Token is already blacklisted"],
    },
    
},{
    timestamps: true
})


// ! this will make delete blacklisted token till 3 days and after that delete it from database 
tokenBlackListSchema.index({createdAt: 1},{
    expireAfterSeconds: 60*60*24*3
})

const tokenBlackListModel = mongoose.model("tokenBlackList",tokenBlackListSchema);

module.exports = tokenBlackListModel;