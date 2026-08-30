import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { dummyCarData } from "../assets/assets";

// Base URL setup with fallback
const backendURL = import.meta.env.VITE_BASE_URL || "http://localhost:5002";
axios.defaults.baseURL = backendURL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // State Variables
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Project specific states (Car & Booking)
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState(dummyCarData || []);
  const [loadingCars, setLoadingCars] = useState(false);

  // Favorites / Wishlist State
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("teracar_favorites") || "[]");
    } catch {
      return [];
    }
  });

  // Comparison State
  const [compareCars, setCompareCars] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Direct Messaging / Chat State
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatCarContext, setActiveChatCarContext] = useState(null);

  const openChat = (carContext = null) => {
    setActiveChatCarContext(carContext);
    setShowChatModal(true);
  };

  // Toggle favorite
  const toggleFavorite = (carId) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(carId)) {
        updated = prev.filter((id) => id !== carId);
        toast.success("Removed from Saved Vehicles");
      } else {
        updated = [...prev, carId];
        toast.success("Saved to VIP Shortlist");
      }
      localStorage.setItem("teracar_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (carId) => favorites.includes(carId);

  // Comparison management
  const addToCompare = (car) => {
    if (compareCars.some((c) => c._id === car._id)) {
      setShowCompareModal(true);
      return;
    }
    if (compareCars.length >= 3) {
      toast.error("You can compare up to 3 vehicles at once");
      setShowCompareModal(true);
      return;
    }
    setCompareCars([...compareCars, car]);
    toast.success(`Added ${car.title || car.brand} to Comparison Matrix`);
    setShowCompareModal(true);
  };

  const removeFromCompare = (carId) => {
    setCompareCars(compareCars.filter((c) => c._id !== carId));
  };

  const clearCompare = () => {
    setCompareCars([]);
  };

  // 1. Sync token with axios default headers & localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 2. Fetch current logged-in user details
  const fetchUser = useCallback(async (authToken) => {
    const activeToken = authToken || token || localStorage.getItem("token");
    
    if (!activeToken) {
      setUser(null);
      setIsOwner(false);
      return false;
    }

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (data?.success && data?.user) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        return true;
      }

      setToken("");
      setUser(null);
      setIsOwner(false);
      return false;

    } catch (error) {
      console.error("fetchUser error:", error.response?.data?.message || error.message);

      if (error.response?.status === 401) {
        setToken("");
        setUser(null);
        setIsOwner(false);
      }
      return false;
    }
  }, [token]);

  // 3. Get all available cars
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
      console.error("fetchCars error:", error.response?.data?.message || error.message);
      setCars(dummyCarData || []);
    } finally {
      setLoadingCars(false);
    }
  }, []);

  // 4. Logout user cleanly
  const logout = () => {
    setToken("");
    setUser(null);
    setIsOwner(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Successfully signed out");
    navigate("/");
  };

  // 5. Initial App Load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
    fetchCars();
  }, [fetchCars, fetchUser]);

  // 6. Context Values
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
    compareCars,
    setCompareCars,
    showCompareModal,
    setShowCompareModal,
    addToCompare,
    removeFromCompare,
    clearCompare,
    showChatModal,
    setShowChatModal,
    activeChatCarContext,
    setActiveChatCarContext,
    openChat,
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