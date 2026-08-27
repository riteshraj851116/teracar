import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { dummyCarData, dummyUserData } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5002';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Initialize with full premium fleet
    const [cars, setCars] = useState(dummyCarData);

    // Normalize car properties to ensure all fields are consistently accessible
    const normalizeCars = (rawCars) => {
        if (!Array.isArray(rawCars) || rawCars.length === 0) return dummyCarData;
        return rawCars.map((c) => ({
            ...c,
            title: c.title || `${c.brand} ${c.model}`,
            price: c.pricePerDay || c.price || 300,
            pricePerDay: c.pricePerDay || c.price || 300,
            seats: c.seating_capacity || c.seats || 2,
            seating_capacity: c.seating_capacity || c.seats || 2,
            fuelType: c.fuel_type || c.fuelType || 'Petrol',
            fuel_type: c.fuel_type || c.fuelType || 'Petrol',
            isAvaliable: c.isAvaliable !== undefined ? c.isAvaliable : true,
        }));
    };

    // Function to check if user is logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data');
            if (data.success && data.user) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            }
        } catch (error) {
            console.log("Using cached/guest session:", error.message);
        }
    };

    // Function to fetch all cars from the server
    const fetchCars = async () => {
        try {
            const { data } = await axios.get('/api/user/cars');
            if (data.success && Array.isArray(data.cars) && data.cars.length > 0) {
                setCars(normalizeCars(data.cars));
            } else {
                setCars(dummyCarData);
            }
        } catch (error) {
            console.log("Server fleet fetch fallback to default luxury fleet:", error.message);
            setCars(dummyCarData);
        }
    };

    // Function to log out the user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Successfully logged out');
    };

    // useEffect to retrieve token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `${storedToken}`;
            fetchUser();
        }
        fetchCars();
    }, []);

    // useEffect to re-fetch user when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${token}`;
            fetchUser();
        }
    }, [token]);

    const value = {
        navigate, currency, axios, user, setUser,
        token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout,
        fetchCars, cars, setCars, pickupDate, setPickupDate, returnDate, setReturnDate
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};