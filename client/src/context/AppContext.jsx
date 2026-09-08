import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { dummyCarData } from "../assets/assets";

// Base URL setup
const backendURL = import.meta.env.VITE_BASE_URL && (!import.meta.env.PROD || !import.meta.env.VITE_BASE_URL.includes("localhost"))
  ? import.meta.env.VITE_BASE_URL
  : (import.meta.env.DEV ? (import.meta.env.VITE_BASE_URL || "http://localhost:5002") : "");
axios.defaults.baseURL = backendURL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // Auth State
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Car & Booking State
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState(dummyCarData || []);
  const [loadingCars, setLoadingCars] = useState(false);

  // Wishlist State (local + will sync to server when backend supports it)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carrental_favorites") || "[]");
    } catch {
      return [];
    }
  });

  // Toggle favorite
  const toggleFavorite = (carId) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(carId)) {
        updated = prev.filter((id) => id !== carId);
        toast.success("Removed from saved cars");
      } else {
        updated = [...prev, carId];
        toast.success("Saved to wishlist");
      }
      localStorage.setItem("carrental_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (carId) => favorites.includes(carId);

  // Sync token with axios headers & localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch user data
  const fetchUser = useCallback(async (authToken) => {
    const activeToken = authToken || token || localStorage.getItem("token");

    if (!activeToken) {
      setUser(null);
      setIsOwner(false);
      return false;
    }

    const cachedUser = JSON.parse(localStorage.getItem("carrental_user") || "null");

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (data?.success && data?.user) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        localStorage.setItem("carrental_user", JSON.stringify(data.user));
        return true;
      }
    } catch (error) {
      console.warn("fetchUser:", error.response?.data?.message || error.message);
    }

    if (cachedUser) {
      setUser(cachedUser);
      setIsOwner(cachedUser.role === "owner");
      return true;
    }

    return false;
  }, [token]);

  // Fetch cars
  const fetchCars = useCallback(async () => {
    try {
      setLoadingCars(true);
      const { data } = await axios.get("/api/user/cars");
      if (data?.success && Array.isArray(data?.cars) && data.cars.length > 0) {
        setCars(data.cars);
      } else {
        setCars(dummyCarData || []);
      }
    } catch (error) {
      console.error("fetchCars:", error.response?.data?.message || error.message);
      setCars(dummyCarData || []);
    } finally {
      setLoadingCars(false);
    }
  }, []);

  // Logout
  const logout = () => {
    setToken("");
    setUser(null);
    setIsOwner(false);
    localStorage.removeItem("token");
    localStorage.removeItem("carrental_user");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Signed out successfully");
    navigate("/");
  };

  // Initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
    fetchCars();
  }, [fetchCars, fetchUser]);

  const value = {
    navigate,
    currency,
    axios,
    token,
    setToken,
    user,
    setUser,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    fetchUser,
    logout,
    fetchCars,
    cars,
    setCars,
    loadingCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    favorites,
    toggleFavorite,
    isFavorite,
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