require("dotenv").config();  // to use env var all over server

const app = require("./src/app");
const connectToDB = require("./src/config/db");


app.listen(3000, () => {
    console.log("Server is running on port 3000");
    connectToDB();
});