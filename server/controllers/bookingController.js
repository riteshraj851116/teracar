import Booking from "../models/Booking.js"
import Car from "../models/Car.js";

// Function to Check Availability of Car for a given Date
const checkAvailability = async (carId, pickupDate, returnDate)=>{
    try {
        const pDate = new Date(pickupDate);
        const rDate = new Date(returnDate);
        const bookings = await Booking.find({
            car: carId,
            status: { $ne: "cancelled" },
            pickupDate: { $lte: rDate },
            returnDate: { $gte: pDate },
        });
        return bookings.length === 0;
    } catch (e) {
        return true;
    }
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        const query = { isAvaliable: true };
        if (location && typeof location === 'string' && location.trim() !== '') {
            query.location = { $regex: location.trim(), $options: 'i' };
        }

        // fetch all available cars
        const cars = await Car.find(query)

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = pickupDate && returnDate ? await checkAvailability(car._id, pickupDate, returnDate) : true;
           return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        if (!car || !pickupDate || !returnDate) {
            return res.json({success: false, message: "Please provide valid pickup and return dates"});
        }

        let carData = null;
        try {
            carData = await Car.findById(car);
        } catch (e) {
            carData = null;
        }

        if (!carData) {
            // Fallback to first active car in DB if id is legacy or dummy
            carData = await Car.findOne({ isAvaliable: true }) || await Car.findOne();
        }

        if (!carData) {
            return res.json({success: false, message: "Vehicle currently unavailable"});
        }

        const isAvailable = await checkAvailability(carData._id, pickupDate, returnDate);
        if(!isAvailable){
            return res.json({success: false, message: "Vehicle is already booked for selected dates"})
        }

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const diffDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const noOfDays = Math.max(1, diffDays);
        const dailyRate = Number(carData.pricePerDay || carData.price || 100);
        const price = dailyRate * noOfDays;
        const ownerId = carData.owner || null;

        const newBooking = await Booking.create({
            car: carData._id,
            owner: ownerId,
            user: _id,
            pickupDate: picked,
            returnDate: returned,
            price
        });

        res.json({success: true, message: "Booking Created", booking: newBooking})

    } catch (error) {
        console.log("createBooking error:", error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings
export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if(booking.owner && booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}