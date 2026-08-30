import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Calendar, 
  Car, 
  ArrowRight, 
  QrCode, 
  Key, 
  Printer, 
  X,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { playUiClick } from '../utils/audioEngine';

const MyBookings = () => {
  const { axios, currency, user, setShowLogin, openChat } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassBooking, setSelectedPassBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const local = JSON.parse(localStorage.getItem('teracar_local_bookings') || '[]');

      try {
        const { data } = await axios.get('/api/bookings/user');
        if (data?.success && Array.isArray(data?.bookings) && data.bookings.length > 0) {
          // Merge unique bookings
          const serverIds = new Set(data.bookings.map(b => b._id));
          const filteredLocal = local.filter(b => !serverIds.has(b._id));
          setBookings([...data.bookings, ...filteredLocal]);
          return;
        }
      } catch (err) {
        console.warn("Server bookings API notice:", err.response?.data?.message || err.message);
      }

      setBookings(local);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="p-8 bg-white border border-[#E2E8F0] rounded-lg text-center max-w-sm flex flex-col items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md flex items-center justify-center">
            <Car className="w-6 h-6 text-[#090D16]" />
          </div>
          <h2 className="text-xl font-bold uppercase text-[#090D16] font-editorial">Authentication Required</h2>
          <p className="text-xs font-mono text-[#64748B]">
            Sign in to view your reservations and access digital vehicle keys.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="w-full py-3 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-[#E2E8F0] pb-6">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#64748B] uppercase">
            CLIENT LEDGER // RESERVATION RECORDS
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#090D16] uppercase font-editorial tracking-tight">
            My Reservations ({bookings.length})
          </h1>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono tracking-widest text-[#64748B] uppercase">
            Fetching reservation ledger...
          </div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => {
              const car = booking.car || {};
              const carTitle = car.title || `${car.brand || ''} ${car.model || 'Machine'}`.trim() || 'Chassis';

              return (
                <div
                  key={booking._id}
                  className="p-5 bg-white border border-[#E2E8F0] hover:border-[#090D16] rounded-lg flex flex-col md:flex-row items-center justify-between gap-5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="w-full sm:w-36 h-24 bg-[#F8FAFC] rounded border border-[#E2E8F0] shrink-0 flex items-center justify-center p-2">
                      <img 
                        src={car.image} 
                        alt={carTitle} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                      <span className="text-[9px] font-mono text-[#64748B] uppercase">
                        {car.brand || 'ATELIER'}
                      </span>
                      <h3 className="text-base font-bold text-[#090D16] uppercase font-editorial">
                        {carTitle}
                      </h3>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#475569] uppercase mt-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#090D16]" />
                          <span>{new Date(booking.pickupDate).toLocaleDateString()}</span>
                        </div>
                        <span>→</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#090D16]" />
                          <span>{new Date(booking.returnDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-col sm:flex-row items-center md:items-end justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E8F0]">
                    <div className="text-center md:text-right">
                      <p className="text-[9px] font-mono text-[#64748B] uppercase">Total Allocated</p>
                      <p className="text-xl font-bold text-[#090D16] font-mono">
                        {currency}{booking.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-[9px] font-mono uppercase font-bold border rounded border-[#E2E8F0] bg-[#F8FAFC] text-[#090D16]">
                        {booking.status || 'Confirmed'}
                      </span>

                      <button
                        onClick={() => {
                          playUiClick();
                          openChat(booking.car);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#090D16] border border-[#E2E8F0] rounded text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        title="Chat with Concierge"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Concierge</span>
                      </button>

                      <button
                        onClick={() => setSelectedPassBooking(booking)}
                        className="px-3 py-1.5 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <Key className="w-3 h-3" />
                        <span>Pass</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-[#E2E8F0] rounded-lg flex flex-col items-center gap-3">
            <Car className="w-8 h-8 text-[#94A3B8]" />
            <h3 className="text-base font-bold text-[#090D16] uppercase font-mono">No Active Reservations</h3>
            <Link
              to="/cars"
              className="px-4 py-2 bg-[#090D16] text-white rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Explore Fleet</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Digital Pass Modal */}
      {selectedPassBooking && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-sm bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[9px] font-mono text-[#64748B] uppercase">DIGITAL ACCESS PASS</span>
                <h3 className="text-base font-bold uppercase text-[#090D16] font-editorial">
                  {selectedPassBooking.car?.title || 'Vehicle Pass'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPassBooking(null)}
                className="p-1 text-[#64748B] hover:text-[#090D16] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex flex-col items-center text-center gap-2">
              <QrCode className="w-20 h-20 text-[#090D16]" />
              <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-wider">DIGITAL KEY PIN</span>
              <span className="text-lg font-bold font-mono tracking-widest text-[#090D16]">
                {(selectedPassBooking._id || '').slice(-6).toUpperCase()}
              </span>
            </div>

            <div className="text-[10px] font-mono uppercase space-y-1 text-[#475569]">
              <div className="flex justify-between">
                <span>Pickup:</span>
                <span className="font-bold text-[#090D16]">{new Date(selectedPassBooking.pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Return:</span>
                <span className="font-bold text-[#090D16]">{new Date(selectedPassBooking.returnDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-t border-[#E2E8F0] pt-1">
                <span>Paid:</span>
                <span className="font-bold text-[#090D16]">{currency}{selectedPassBooking.price}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;