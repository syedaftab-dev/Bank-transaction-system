require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const connectToDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

// Connect to Database first then start server
connectToDB();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});