import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import Car from "./models/Car.js";

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Seed complete 12 luxury supercar fleet
const seedFleet = async () => {
    try {
        const count = await Car.countDocuments();
        if (count < 12) {
            console.log("Updating database with complete 12 luxury supercar fleet...");
            await Car.deleteMany({});
            const initialFleet = [
                {
                    brand: "Porsche",
                    model: "911 GT3 RS",
                    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Supercar",
                    seating_capacity: 2,
                    fuel_type: "4.0L Naturally Aspirated Boxer",
                    transmission: "7-Speed PDK",
                    pricePerDay: 950,
                    location: "Los Angeles",
                    description: "The ultimate track weapon with DRS aerodynamics, race-derived suspension, and 518 naturally aspirated horsepower.",
                    isAvaliable: true
                },
                {
                    brand: "Ferrari",
                    model: "F8 Tributo",
                    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Supercar",
                    seating_capacity: 2,
                    fuel_type: "3.9L Twin-Turbo V8",
                    transmission: "7-Speed Dual-Clutch F1",
                    pricePerDay: 1250,
                    location: "Miami",
                    description: "An Italian masterpiece generating 710 horsepower with 0-60 in 2.9 seconds.",
                    isAvaliable: true
                },
                {
                    brand: "Lamborghini",
                    model: "Huracán Evo",
                    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Supercar",
                    seating_capacity: 2,
                    fuel_type: "5.2L V10 Petrol",
                    transmission: "7-Speed LDF Dual-Clutch",
                    pricePerDay: 1400,
                    location: "Miami",
                    description: "Screaming naturally aspirated 630 hp V10 engine and all-wheel steering.",
                    isAvaliable: true
                },
                {
                    brand: "Rolls-Royce",
                    model: "Ghost Extended",
                    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Luxury",
                    seating_capacity: 4,
                    fuel_type: "6.75L Twin-Turbo V12",
                    transmission: "8-Speed Satellite Auto",
                    pricePerDay: 1800,
                    location: "New York",
                    description: "Pinnacle of executive luxury with Starlight Headliner and Planar suspension.",
                    isAvaliable: true
                },
                {
                    brand: "McLaren",
                    model: "720S Spider",
                    image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop",
                    year: 2023,
                    category: "Supercar",
                    seating_capacity: 2,
                    fuel_type: "4.0L Twin-Turbo V8",
                    transmission: "7-Speed Seamless Shift",
                    pricePerDay: 1350,
                    location: "Los Angeles",
                    description: "Carbon fiber Monocage II-S chassis, dihedral doors, and 710 hp output.",
                    isAvaliable: true
                },
                {
                    brand: "Mercedes-AMG",
                    model: "G 63",
                    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "SUV",
                    seating_capacity: 5,
                    fuel_type: "4.0L V8 Biturbo",
                    transmission: "AMG SPEEDSHIFT 9-Speed",
                    pricePerDay: 750,
                    location: "Houston",
                    description: "Iconic luxury off-road icon featuring side-pipe AMG exhausts and 577 horsepower.",
                    isAvaliable: true
                },
                {
                    brand: "Aston Martin",
                    model: "DB12 Super Tourer",
                    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Luxury",
                    seating_capacity: 4,
                    fuel_type: "4.0L Twin-Turbo V8",
                    transmission: "8-Speed Automatic",
                    pricePerDay: 1100,
                    location: "Chicago",
                    description: "The world's first Super Tourer with 671 hp and hand-stitched leather interior.",
                    isAvaliable: true
                },
                {
                    brand: "Porsche",
                    model: "Taycan Turbo S",
                    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Electric",
                    seating_capacity: 4,
                    fuel_type: "Dual Permanent Magnet EV",
                    transmission: "2-Speed Rear Transmission",
                    pricePerDay: 680,
                    location: "San Francisco",
                    description: "750 horsepower overboost launch control with 800-volt rapid charging architecture.",
                    isAvaliable: true
                },
                {
                    brand: "BMW",
                    model: "M8 Competition Gran Coupe",
                    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Luxury",
                    seating_capacity: 5,
                    fuel_type: "4.4L M TwinPower Turbo V8",
                    transmission: "8-Speed M Steptronic",
                    pricePerDay: 620,
                    location: "New York",
                    description: "617 horsepower executive express featuring M xDrive with drift mode.",
                    isAvaliable: true
                },
                {
                    brand: "Audi",
                    model: "RS e-tron GT",
                    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Electric",
                    seating_capacity: 4,
                    fuel_type: "Dual Synchronous Motors",
                    transmission: "2-Speed Transmission",
                    pricePerDay: 590,
                    location: "Chicago",
                    description: "Grand touring coupe with 637 hp boost mode and Matrix LED lighting.",
                    isAvaliable: true
                },
                {
                    brand: "Bentley",
                    model: "Continental GT Speed",
                    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Luxury",
                    seating_capacity: 4,
                    fuel_type: "6.0L Twin-Turbo W12",
                    transmission: "8-Speed Dual-Clutch",
                    pricePerDay: 1050,
                    location: "Miami",
                    description: "Grand tourer powered by 650 hp W12 with diamond quilting interior.",
                    isAvaliable: true
                },
                {
                    brand: "Tesla",
                    model: "Model S Plaid",
                    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
                    year: 2024,
                    category: "Electric",
                    seating_capacity: 5,
                    fuel_type: "Tri-Motor AWD Electric",
                    transmission: "Direct Drive Single-Speed",
                    pricePerDay: 450,
                    location: "Los Angeles",
                    description: "1,020 horsepower with 0-60 in 1.99s and next-gen cockpit.",
                    isAvaliable: true
                }
            ];
            await Car.insertMany(initialFleet);
            console.log("Full 12-car fleet seeded successfully!");
        }
    } catch (e) {
        console.log("Fleet seed notice:", e.message);
    }
};

// Connect Database
try {
    await connectDB();
    await seedFleet();
} catch (err) {
    console.log("Database connection notice:", err.message);
}

app.get('/', (req, res) => res.send("VELOCITY Luxury Mobility Server running"));
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));