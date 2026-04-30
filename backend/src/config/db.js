const mongoose = require("mongoose");

// connect to db
async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            tls: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to DB successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:");
        console.error(err.message);
        
        if (err.message.includes('ENOTFOUND') && process.env.MONGODB_URI.includes('mongodb+srv')) {
            console.warn("\n💡 TIP: Your network might be blocking MongoDB Atlas DNS (SRV records).");
            console.warn("Try these solutions:");
            console.warn("1. Check your DNS settings (use Google DNS 8.8.8.8).");
            console.warn("2. Whitelist your IP in MongoDB Atlas dashboard.");
            console.warn("3. If you have MongoDB installed locally, try using: MONGODB_URI=mongodb://localhost:27017/bankSystem\n");
        }
        
        // Don't exit immediately in dev mode to allow nodemon to keep running
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

module.exports = connectToDB;