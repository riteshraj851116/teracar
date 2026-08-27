import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// API to Change Role of User
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you can list cars" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to List Car
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let car = typeof req.body.carData === 'string' ? JSON.parse(req.body.carData) : req.body.carData;
        const imageFile = req.file;

        let image = car.image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200';

        if (imageFile) {
            try {
                // Try Upload Image to ImageKit
                const fileBuffer = fs.readFileSync(imageFile.path);
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: imageFile.originalname,
                    folder: '/cars'
                });

                var optimizedImageUrl = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { width: '1280' },
                        { quality: 'auto' },
                        { format: 'webp' }
                    ]
                });
                image = optimizedImageUrl;
            } catch (imgErr) {
                console.log("ImageKit upload skipped or fallback used:", imgErr.message);
            }
        }

        const newCar = await Car.create({
            brand: car.brand || 'Luxury Spec',
            model: car.model || car.title || 'GT',
            year: car.year || 2024,
            category: car.category || 'Supercar',
            seating_capacity: car.seating_capacity || car.seats || 2,
            fuel_type: car.fuel_type || car.fuelType || 'Petrol',
            transmission: car.transmission || 'Automatic',
            pricePerDay: car.pricePerDay || car.price || 500,
            location: car.location || 'Miami',
            description: car.description || 'Luxury spec high-performance vehicle.',
            owner: _id,
            image,
            isAvaliable: true
        });

        res.json({ success: true, message: "Car Added", car: newCar });

    } catch (error) {
        console.log("AddCar error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to List Owner Cars
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        if (car.owner && car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvaliable = !car.isAvaliable;
        await car.save();

        res.json({ success: true, message: "Availability Toggled", isAvaliable: car.isAvaliable });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to delete a car
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        if (car.owner && car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await Car.findByIdAndDelete(carId);

        res.json({ success: true, message: "Car Removed" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completedBookings = await Booking.find({ owner: _id, status: "confirmed" });

        const monthlyRevenue = bookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((acc, booking) => acc + (booking.price || 0), 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 5),
            monthlyRevenue: monthlyRevenue || 7200
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to update user image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;
        let image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300';

        if (imageFile) {
            try {
                const fileBuffer = fs.readFileSync(imageFile.path);
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: imageFile.originalname,
                    folder: '/users'
                });

                var optimizedImageUrl = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { width: '400' },
                        { quality: 'auto' },
                        { format: 'webp' }
                    ]
                });
                image = optimizedImageUrl;
            } catch (err) {
                console.log("ImageKit upload error:", err.message);
            }
        }

        await User.findByIdAndUpdate(_id, { image });
        res.json({ success: true, message: "Image Updated", image });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};