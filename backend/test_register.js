require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const authService = require("./src/services/auth.service");

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");
  
  try {
    const res = await authService.registerUser({
      name: "Test User",
      email: "testuser_" + Date.now() + "@test.com",
      password: "password123"
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error during register:", err);
  }
  
  process.exit(0);
}

test();
