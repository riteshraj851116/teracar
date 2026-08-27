import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ParticleBackground from '../components/3d/ParticleBackground';
import toast from 'react-hot-toast';
import { Calendar, Clock, CheckCircle2, AlertCircle, Car, ShieldCheck, ArrowRight } from 'lucide-react';
import { dummyMyBookingsData } from '../assets/assets';

const MyBookings = () => {
  const { axios, currency, user, setShowLogin, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const localBookings = JSON.parse(localStorage.getItem('local_bookings') || '[]');
      
      try {
        const { data } = await axios.get('/api/bookings/user');
        if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
          setBookings([...localBookings, ...data.bookings]);
          return;
        }
      } catch (err) {
        console.log("Server bookings fallback:", err.message);
      }

      if (localBookings.length > 0) {
        setBookings([...localBookings, ...dummyMyBookingsData]);
      } else {
        setBookings(dummyMyBookingsData);
      }
    } catch (err) {
      setBookings(dummyMyBookingsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">
              MY RENTALS // ACTIVE & PAST RESERVATIONS
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              My Reservations ({bookings.length})
            </h1>
          </div>

          <button
            onClick={() => navigate('/cars')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs self-start sm:self-auto shadow-sm cursor-pointer hover:bg-slate-800 transition-all"
          >
            <span>Book Another Supercar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono">Loading reservations telemetry...</div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-5">
            {bookings.map((booking) => {
              const car = booking.car || {};
              const carTitle = car.title || `${car.brand || ''} ${car.model || ''}`.trim() || 'Supercar Spec';
              const statusColors = {
                confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                pending: 'bg-amber-50 text-amber-700 border-amber-200',
                cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
              };

              return (
                <div
                  key={booking._id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Car Details Left */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                    <div className="w-full sm:w-40 h-28 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={car.image} alt={carTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                      <span className="text-[10px] font-mono text-cyan-600 font-bold uppercase tracking-widest">
                        {car.brand || 'Luxury Spec'}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{carTitle}</h3>

                      {/* Dates */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-slate-500 mt-2">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Pickup: {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'Instant'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Return: {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : 'TBD'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Price Right */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-mono text-slate-400 uppercase font-medium">Total Rate</p>
                      <p className="text-xl font-black text-slate-900 font-mono">
                        <span className="text-cyan-600">{currency}</span>
                        {(booking.price || 75000).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border capitalize flex items-center gap-1.5 ${
                        statusColors[booking.status] || statusColors.pending
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      <span>{booking.status || 'Pending'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 my-8 shadow-sm">
            <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Active Reservations</h3>
            <p className="text-xs text-slate-500 mt-1">Ready to drive? Explore our 3D luxury and supercar fleet now.</p>
            <button
              onClick={() => navigate('/cars')}
              className="mt-4 px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-sm"
            >
              Browse Inventory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
