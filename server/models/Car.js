import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const carSchema = new mongoose.Schema({
    owner: {type: ObjectId, ref: 'User'},
    title: {type: String},
    brand: {type: String, required: true},
    model: {type: String},
    image: {type: String, required: true},
    year: {type: Number, default: new Date().getFullYear()},
    category: {type: String, required: true},
    seating_capacity: {type: Number, default: 2},
    fuel_type: { type: String, default: 'Petrol' },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvaliable: {type: Boolean, default: true}
},{timestamps: true})

const Car = mongoose.model('Car', carSchema)

export default Car