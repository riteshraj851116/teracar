import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Load environment variables from both cwd and server/.env
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "server", ".env") });

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serverless DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection middleware error:", err.message);
  }
  next();
});

// Root & Health Check Endpoints
app.get("/", (req, res) => res.send("TERACAR API Server is running"));
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TERACAR API is running",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/messages", messageRouter);

// Start server listener for standalone local execution
const PORT = process.env.PORT || 5002;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;