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
    let uri = rawUri;
    if (!rawUri.includes("/car-rental")) {
      if (rawUri.includes("?")) {
        const [base, query] = rawUri.split("?");
        uri = `${base.replace(/\/+$/, "")}/car-rental?${query}`;
      } else {
        uri = `${rawUri.replace(/\/+$/, "")}/car-rental`;
      }
    }

    if (!process.env.MONGODB_URI && (process.env.VERCEL || process.env.NODE_ENV === "production")) {
      console.warn("MONGODB_URI not configured in production environment.");
      return null;
    }

    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
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