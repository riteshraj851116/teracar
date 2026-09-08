import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  MapPin,
  Car,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Heart,
  User as UserIcon,
  Bell,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const MyBookings = () => {
  const { axios, token, user, setShowLogin, currency, navigate, favorites } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | past | saved | notifications | profile

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/user');
      if (data?.success && Array.isArray(data?.bookings)) {
        setBookings(data.bookings);
        if (data.bookings.length > 0) {
          setExpandedId(data.bookings[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this active vehicle reservation?')) return;

    setCancellingId(bookingId);
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status: 'cancelled',
      });
      if (data?.success) {
        toast.success('Reservation cancelled');
        fetchBookings();
      } else {
        toast.error(data?.message || 'Cancellation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancellingId(null);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center text-center section-padding bg-[#0B0B0B] text-[#F4F2ED]">
        <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase mb-2 font-bold">
          SECURITY ACCESS REQUIRED
        </span>
        <h2 className="text-4xl font-display font-extrabold uppercase mb-4 text-[#F4F2ED]">
          SIGN IN TO ACCESS DASHBOARD
        </h2>
        <p className="text-sm font-body text-[#9B9B9B] max-w-sm mb-6 leading-relaxed">
          Access your private reservations, concierge timeline, and vehicle dispatches.
        </p>
        <button
          onClick={() => setShowLogin(true)}
          className="btn-club-primary"
        >
          SIGN IN TO ACCOUNT
        </button>
      </div>
    );
  }

  // Active / next journey
  const nextJourney = bookings.find((b) => b.status !== 'cancelled') || bookings[0];
  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed');
  const pastBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'completed');

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F2ED] pb-24 select-none">
      
      {/* 21 — Heading: WELCOME BACK. */}
      <div className="border-b border-white/14 bg-[#0B0B0B] py-14">
        <div className="max-w-[1440px] mx-auto section-padding">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
              MEMBER TELEMETRY // 2026
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight uppercase text-[#F4F2ED]">
                WELCOME BACK.
              </h1>
              <p className="text-xs font-mono text-[#9B9B9B] uppercase tracking-widest mt-2">
                AUTHENTICATED DISPATCH PROFILE: {user?.name || user?.email}
              </p>
            </div>

            <Link
              to="/cars"
              className="btn-club-primary text-xs"
            >
              <span>EXPLORE FLEET</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 21 — Dashboard Section Tabs: UPCOMING, PAST RENTALS, SAVED VEHICLES, NOTIFICATIONS, PROFILE */}
      <div className="border-b border-white/14 bg-[#141414] sticky top-[61px] z-30 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto section-padding flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-mono py-2.5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 uppercase transition-colors cursor-pointer border ${
              activeTab === 'upcoming'
                ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                : 'bg-transparent text-[#9B9B9B] border-transparent hover:text-white'
            }`}
          >
            UPCOMING ({upcomingBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`px-3 py-1.5 uppercase transition-colors cursor-pointer border ${
              activeTab === 'past'
                ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                : 'bg-transparent text-[#9B9B9B] border-transparent hover:text-white'
            }`}
          >
            PAST RENTALS ({pastBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 uppercase transition-colors cursor-pointer border ${
              activeTab === 'saved'
                ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                : 'bg-transparent text-[#9B9B9B] border-transparent hover:text-white'
            }`}
          >
            SAVED VEHICLES ({favorites?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 uppercase transition-colors cursor-pointer border ${
              activeTab === 'notifications'
                ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                : 'bg-transparent text-[#9B9B9B] border-transparent hover:text-white'
            }`}
          >
            NOTIFICATIONS (1)
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 uppercase transition-colors cursor-pointer border ${
              activeTab === 'profile'
                ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                : 'bg-transparent text-[#9B9B9B] border-transparent hover:text-white'
            }`}
          >
            PROFILE
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto section-padding pt-12 space-y-14">
        
        {/* 21 — YOUR NEXT JOURNEY Capsule (If active booking exists) */}
        {nextJourney && activeTab === 'upcoming' && (
          <div className="bg-[#141414] border border-white/14 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-bold block">
                  YOUR NEXT JOURNEY
                </span>

                <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-[#F4F2ED]">
                  {nextJourney.car?.brand} {nextJourney.car?.model}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#9B9B9B] uppercase">
                  <span className="text-[#F4F2ED] font-bold">{nextJourney.car?.location || 'DELHI NCR'} → CONTINENTAL</span>
                  <span>//</span>
                  <span>{new Date(nextJourney.pickupDate).toLocaleDateString()} — {new Date(nextJourney.returnDate).toLocaleDateString()}</span>
                  <span>//</span>
                  <span className="text-[#C5A880] font-bold uppercase">{nextJourney.status || 'CONFIRMED'}</span>
                </div>
              </div>

              {/* Vehicle visual */}
              {nextJourney.car?.image && (
                <div className="w-72 h-36 flex items-center justify-center p-2 bg-[#1B1B1B] border border-white/10">
                  <img
                    src={nextJourney.car.image}
                    alt=""
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 22 — BOOKING HISTORY ARCHIVE (01 BMW M4 12 SEP 2026, 02 RANGE ROVER...) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/14">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block mb-1 font-bold">
                TELEMETRY ARCHIVE
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-[#F4F2ED]">
                {activeTab === 'past' ? 'PAST RENTALS' : 'RESERVATION ARCHIVE'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#9B9B9B]">
              {bookings.length} TOTAL ALLOCATIONS
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-[#9B9B9B] uppercase tracking-widest">
              QUERYING ARCHIVE RECORDS...
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center border border-white/14 bg-[#141414] p-8">
              <p className="text-sm font-mono uppercase text-[#9B9B9B] mb-6">
                NO RESERVATION ARCHIVES DETECTED FOR THIS PROFILE.
              </p>
              <Link to="/cars" className="btn-club-primary">
                DISCOVER OUR FLEET
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/14 border-t border-b border-white/14">
              {bookings.map((b, index) => {
                const num = String(index + 1).padStart(2, '0');
                const isExpanded = expandedId === b._id;
                const isCancelled = b.status === 'cancelled';

                return (
                  <div key={b._id} className="transition-colors hover:bg-[#141414]">
                    {/* Main Row: Click expands details */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : b._id)}
                      className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer px-2 sm:px-4"
                    >
                      <div className="flex items-baseline gap-6 sm:gap-10">
                        <span className="text-xs font-mono text-[#6E6E6E]">
                          {num}
                        </span>

                        <div>
                          <h4 className="text-xl sm:text-2xl font-display font-bold uppercase text-[#F4F2ED]">
                            {b.car?.brand} {b.car?.model}
                          </h4>
                          <span className="text-xs font-mono text-[#9B9B9B] block mt-1">
                            {new Date(b.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs font-mono">
                        <span className={`px-2.5 py-1 border text-[10px] uppercase ${
                          isCancelled
                            ? 'border-red-500/40 text-red-400'
                            : 'border-[#C5A880]/50 text-[#C5A880]'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>

                        <span className="font-bold text-[#F4F2ED]">
                          {currency}{Number(b.totalPrice || b.car?.pricePerDay || 15000).toLocaleString()}
                        </span>

                        <ChevronDown className={`w-4 h-4 text-[#9B9B9B] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* 22 — Expanded Details */}
                    {isExpanded && (
                      <div className="p-6 bg-[#141414] border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs font-mono animate-fade-in">
                        <div className="md:col-span-4 space-y-2">
                          <span className="text-[10px] text-[#6E6E6E] uppercase block">RESERVATION ID</span>
                          <span className="text-[#F4F2ED] font-mono block">{b._id}</span>
                          <span className="text-[10px] text-[#6E6E6E] uppercase block pt-2">PICKUP LOCATION</span>
                          <span className="text-[#F4F2ED] block">{b.car?.location || 'DELHI NCR'}</span>
                        </div>

                        <div className="md:col-span-4 space-y-2">
                          <span className="text-[10px] text-[#6E6E6E] uppercase block">JOURNEY WINDOW</span>
                          <span className="text-[#F4F2ED] block">
                            {new Date(b.pickupDate).toLocaleDateString()} — {new Date(b.returnDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-[#6E6E6E] uppercase block pt-2">CONCIERGE CONTACT</span>
                          <span className="text-[#C5A880] block">+91 11 4982 0000 (24/7)</span>
                        </div>

                        <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end gap-4">
                          <Link
                            to={`/car/${b.car?._id}`}
                            className="text-[#C5A880] hover:underline"
                          >
                            VIEW VEHICLE PROFILE →
                          </Link>

                          {!isCancelled && (
                            <button
                              onClick={() => handleCancel(b._id)}
                              disabled={cancellingId === b._id}
                              className="px-3 py-1.5 border border-red-500/40 hover:bg-red-950/40 text-red-400 text-[10px] uppercase tracking-wider"
                            >
                              {cancellingId === b._id ? 'CANCELLING...' : 'CANCEL ALLOCATION'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Member Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs font-mono text-[#9B9B9B] border-t border-white/14">
          <div>
            <span className="text-[#F4F2ED] font-bold block mb-1 uppercase">SATELLITE TELEMETRY</span>
            <p className="leading-relaxed">All allocations include GPS emergency locator and track status updates.</p>
          </div>
          <div>
            <span className="text-[#F4F2ED] font-bold block mb-1 uppercase">AIRPORT DISPATCH</span>
            <p className="leading-relaxed">Curbside handover at VIP FBO terminals in Delhi, Mumbai, and Bangalore.</p>
          </div>
          <div>
            <span className="text-[#F4F2ED] font-bold block mb-1 uppercase">CHAUFFEUR OPTIONS</span>
            <p className="leading-relaxed">Switch seamlessly between self-drive and licensed chauffeur pilot.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;