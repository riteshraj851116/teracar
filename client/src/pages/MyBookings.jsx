import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ParticleBackground from '../components/3d/ParticleBackground';
import toast from 'react-hot-toast';
import { Calendar, Clock, CheckCircle2, AlertCircle, Car, ShieldCheck } from 'lucide-react';

const MyBookings = () => {
  const { axios, currency, user, setShowLogin, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/user');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <ParticleBackground />
        <div className="p-8 rounded-3xl glass-card border border-white/10 text-center max-w-md flex flex-col items-center gap-4 relative z-10">
          <Car className="w-12 h-12 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Sign In Required</h2>
          <p className="text-xs text-slate-400">Please sign in to access your active 3D supercar rentals & history.</p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            MY RENTALS // ACTIVE & PAST TELEMETRY
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            My Reservations ({bookings.length})
          </h1>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono">Loading reservations telemetry...</div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => {
              const car = booking.car || {};
              const statusColors = {
                confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
              };

              return (
                <div
                  key={booking._id}
                  className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                >
                  {/* Car Details Left */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                    <div className="w-full sm:w-36 h-28 bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      <img src={car.image} alt={car.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                        {car.brand || 'Luxury Spec'}
                      </span>
                      <h3 className="text-lg font-bold text-white">{car.title || 'Supercar Spec'}</h3>

                      {/* Dates */}
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>From: {new Date(booking.pickupDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          <span>To: {new Date(booking.returnDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Price Right */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Total Paid</p>
                      <p className="text-xl font-black text-cyan-400 font-mono">
                        {currency}
                        {booking.price}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border capitalize flex items-center gap-1.5 ${
                        statusColors[booking.status] || statusColors.pending
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      <span>{booking.status || 'Pending'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center glass-card rounded-3xl border border-white/10 my-8">
            <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Active Reservations</h3>
            <p className="text-xs text-slate-400 mt-1">Ready to drive? Explore our 3D supercar fleet now.</p>
            <button
              onClick={() => navigate('/cars')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
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
