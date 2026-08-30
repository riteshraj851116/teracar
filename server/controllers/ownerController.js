import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";


// API to Change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Car

export const addCar = async (req, res)=>{
    const imageFile = req.file;
    try {
        const {_id} = req.user;
        let car = typeof req.body.carData === 'string' ? JSON.parse(req.body.carData) : req.body.carData;

        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        let image = '';
        try {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/cars'
            });

            image = imagekit.url({
                path : response.filePath,
                transformation : [
                    {width: '1280'},
                    {quality: 'auto'},
                    { format: 'webp' }
                ]
            });
        } catch (ikError) {
            console.log("ImageKit upload error, using fallback format:", ikError.message);
            const fileBuffer = fs.readFileSync(imageFile.path);
            image = `data:${imageFile.mimetype};base64,${fileBuffer.toString('base64')}`;
        }

        const modelName = car.model || car.title || 'Supercar';
        const carTitle = car.title || `${car.brand} ${modelName}`;
        const seatsCount = Number(car.seating_capacity || car.seats || 2);
        const fuel = car.fuel_type || car.fuelType || 'Petrol';
        const yearVal = Number(car.year || new Date().getFullYear());

        await Car.create({
            ...car,
            owner: _id,
            title: carTitle,
            model: modelName,
            year: yearVal,
            seating_capacity: seatsCount,
            fuel_type: fuel,
            image
        });

        res.json({success: true, message: "Car Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    } finally {
        if (imageFile && imageFile.path && fs.existsSync(imageFile.path)) {
            try { fs.unlinkSync(imageFile.path); } catch (e) {}
        }
    }
}

// API to List Owner Cars
export const getOwnerCars = async (req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id })
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null;
        car.isAvaliable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({owner: _id, status: "pending" })
        const completedBookings = await Booking.find({owner: _id, status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
    const imageFile = req.file;
    try {
        const { _id } = req.user;
        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        let image = '';
        try {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/users'
            });

            image = imagekit.url({
                path : response.filePath,
                transformation : [
                    {width: '400'},
                    {quality: 'auto'},
                    { format: 'webp' }
                ]
            });
        } catch (ikError) {
            console.log("ImageKit upload error, using fallback format:", ikError.message);
            const fileBuffer = fs.readFileSync(imageFile.path);
            image = `data:${imageFile.mimetype};base64,${fileBuffer.toString('base64')}`;
        }

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    } finally {
        if (imageFile && imageFile.path && fs.existsSync(imageFile.path)) {
            try { fs.unlinkSync(imageFile.path); } catch (e) {}
        }
    }
}   