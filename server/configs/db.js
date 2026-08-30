import mongoose from "mongoose";
import { seedDatabaseIfEmpty } from "./seedCars.js";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', async ()=> {
            console.log("Database Connected");
            await seedDatabaseIfEmpty();
        });
        const rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const uri = rawUri.endsWith('/') ? `${rawUri}car-rental` : rawUri.includes('/car-rental') ? rawUri : `${rawUri}/car-rental`;
        await mongoose.connect(uri);
        await seedDatabaseIfEmpty();
    } catch (error) {
        console.log("DB Connection Error:", error.message);
    }
}

export default connectDB;