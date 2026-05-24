require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const connectToDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 3005;

async function testServer() {
  await connectToDB();
  
  const server = app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    
    try {
      const response = await fetch(`http://localhost:${PORT}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Local Test User",
          email: "localtest_" + Date.now() + "@test.com",
          password: "password123"
        })
      });
      
      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response body:", JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Fetch error:", err);
    }
    
    server.close();
    process.exit(0);
  });
}

testServer();
