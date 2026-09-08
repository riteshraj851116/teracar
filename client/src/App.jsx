import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import Wishlist from "./pages/Wishlist";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import { useAppContext } from "./context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAppContext();
  if (!token) return <Navigate to="/" replace />;
  return children;
};

const OwnerProtectedRoute = ({ children }) => {
  const { token, isOwner } = useAppContext();
  if (!token) return <Navigate to="/" replace />;
  if (!isOwner) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const { showLogin } = useAppContext();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F7', color: '#111111' }}>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#111111',
            border: '1px solid #DDDAD5',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#641E2B',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#C0392B',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Loader */}
      {isLoading && (
        <Loader onComplete={() => setIsLoading(false)} />
      )}

      {/* Login Modal */}
      {showLogin && <Login />}

      {/* Navbar — hide on owner pages */}
      {!isOwnerPath && <Navbar />}

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Owner Routes */}
          <Route
            path="/owner"
            element={
              <OwnerProtectedRoute>
                <Layout />
              </OwnerProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer — hide on owner pages */}
      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;