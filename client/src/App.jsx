import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import FloatingChrome from "./components/FloatingChrome";
import SearchOverlay from "./components/SearchOverlay";
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
  const [searchOpen, setSearchOpen] = useState(false);

  const isOwnerPath = location.pathname.startsWith("/owner");

  // Global search keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll handler for in-page anchors across routes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F3F1EC] text-[#111111]">
      
      {/* Tactile Custom Cursor (Desktop only) */}
      <CustomCursor />

      {/* Floating Corner Viewport Chrome */}
      {!isOwnerPath && (
        <FloatingChrome onOpenSearch={() => setSearchOpen(true)} />
      )}

      {/* Full-Screen Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111111',
            color: '#F3F1EC',
            border: '1px solid #D8D5CF',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '0px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#651F2A',
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

      {/* Minimal Loader */}
      {isLoading && (
        <Loader onComplete={() => setIsLoading(false)} />
      )}

      {/* Login Modal */}
      {showLogin && <Login />}

      {/* Editorial Navigation */}
      {!isOwnerPath && (
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Owner Dashboard Routes */}
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

      {/* Editorial Footer */}
      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;