import mongoose from "mongoose";
import { seedDatabaseIfEmpty } from "./seedCars.js";

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    while (mongoose.connection.readyState === 2) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    const rawUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    const uri = rawUri.endsWith("/")
      ? `${rawUri}car-rental`
      : rawUri.includes("/car-rental")
      ? rawUri
      : `${rawUri}/car-rental`;

    await mongoose.connect(uri, {
      bufferCommands: false,
    });
    console.log("Database Connected");
    await seedDatabaseIfEmpty();
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  } finally {
    isConnecting = false;
  }
};

export default connectDB;