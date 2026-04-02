require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Establish database connection first
connectDB().then(() => {
  // Start the server only after successful DB connection
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server due to DB connection error:", error);
  process.exit(1);
});
