const mongoose = require("mongoose");

// connect to db
function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log("Error connecting DB",err);
        process.exit(1); // close the server if DB not connected
    })
}

module.exports = connectToDB;