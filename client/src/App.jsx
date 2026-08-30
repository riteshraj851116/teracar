import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Loader from "./components/Loader";
import AiFleetAssistant from "./components/AiFleetAssistant";
import CarComparisonModal from "./components/CarComparisonModal";
import ChatInboxModal from "./components/ChatInboxModal";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import { useAppContext } from "./context/AppContext";

const OwnerProtectedRoute = ({ children }) => {
  const { token, isOwner } = useAppContext();
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!isOwner) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { 
    showLogin, 
    showCompareModal, 
    setShowCompareModal, 
    compareCars,
    showChatModal,
    setShowChatModal,
    activeChatCarContext
  } = useAppContext();
  
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#090D16] flex flex-col justify-between selection:bg-[#090D16] selection:text-white">
      {/* Swiss Architectural Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#090D16',
            border: '1px solid #E2E8F0',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: '500',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#090D16',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      {/* Swiss Studio Loader */}
      {isLoading && (
        <Loader onComplete={() => setIsLoading(false)} />
      )}

      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

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

      {!isOwnerPath && <AiFleetAssistant />}

      <CarComparisonModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        initialCar={compareCars[0]}
      />

      <ChatInboxModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        activeCarContext={activeChatCarContext}
      />

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;