import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
  });
});
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   // Gracefully shut down the application
//   process.exit(1);
// });

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
//   // Gracefully shut down the application
//   process.exit(1);
// });
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  process.exit(0);
});
