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
  ArrowUpRight,
  ShieldCheck,
  Ban
} from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 'booked', label: 'BOOKED' },
  { id: 'confirmed', label: 'CONFIRMED' },
  { id: 'ready', label: 'READY FOR PICKUP' },
  { id: 'active', label: 'ACTIVE JOURNEY' },
  { id: 'completed', label: 'COMPLETED' },
];

const MyBookings = () => {
  const { axios, token, user, setShowLogin, currency, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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
      <div className="min-h-screen py-24 flex flex-col items-center justify-center text-center section-padding bg-[#F3F1EC]">
        <span className="text-xs font-mono tracking-widest text-[#707070] uppercase mb-2">
          SECURITY ACCESS REQUIRED
        </span>
        <h2 className="text-3xl font-editorial font-bold uppercase mb-4">
          SIGN IN TO ACCESS JOURNEYS
        </h2>
        <p className="text-sm font-body text-[#707070] max-w-sm mb-6">
          Access your private reservations, concierge timeline, and vehicle dispatches.
        </p>
        <button
          onClick={() => setShowLogin(true)}
          className="px-8 py-4 bg-[#111111] text-white text-xs font-mono uppercase tracking-widest font-bold"
        >
          SIGN IN TO ACCOUNT
        </button>
      </div>
    );
  }

  const latestBooking = bookings[0];

  return (
    <div className="min-h-screen py-12 bg-[#F3F1EC] text-[#111111]">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* User Dashboard Header */}
        <div className="pb-10 border-b border-[#D8D5CF] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#707070] uppercase block mb-2">
              USER ARCHIVE // ACCOUNT: {user?.email}
            </span>
            <h1 className="text-4xl sm:text-6xl font-editorial font-bold tracking-tight uppercase leading-none text-[#111111]">
              WELCOME BACK,<br />
              <span className="text-[#651F2A]">{(user?.name || 'GUEST DRIVER').toUpperCase()}.</span>
            </h1>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-[#707070] block">ACTIVE RESERVATIONS:</span>
            <span className="text-2xl font-bold text-[#111111]">{bookings.length}</span>
          </div>
        </div>

        {/* Current Active Journey Highlight (if exists) */}
        {latestBooking && (
          <div className="my-10 border border-[#111111] bg-white p-8 sm:p-10 relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-[#D8D5CF] text-xs font-mono">
              <span className="font-bold text-[#651F2A] uppercase">CURRENT JOURNEY SUMMARY</span>
              <span className="px-3 py-1 bg-[#F3F1EC] border border-[#D8D5CF] uppercase">
                STATUS: {latestBooking.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-xs font-mono text-[#707070] uppercase">
                  CONFIRMED ALLOCATION
                </span>
                <h3 className="text-3xl sm:text-4xl font-editorial font-bold uppercase mt-1">
                  {latestBooking.car?.brand} {latestBooking.car?.model || latestBooking.car?.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#707070] uppercase mt-3">
                  <span>PICKUP: {new Date(latestBooking.pickupDate).toLocaleDateString()}</span>
                  <span>→</span>
                  <span>RETURN: {new Date(latestBooking.returnDate).toLocaleDateString()}</span>
                </div>

                {/* Vertical Timeline */}
                <div className="pt-8 mt-8 border-t border-[#D8D5CF]">
                  <span className="text-[10px] font-mono text-[#707070] uppercase tracking-widest block mb-4">
                    DISPATCH TELEMATICS TIMELINE
                  </span>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] font-mono">
                    {TIMELINE_STEPS.map((step, sIdx) => {
                      const isPast =
                        latestBooking.status === 'confirmed'
                          ? sIdx <= 1
                          : latestBooking.status === 'cancelled'
                          ? sIdx === 0
                          : true;
                      return (
                        <div key={step.id} className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isPast ? 'bg-[#651F2A]' : 'bg-[#D8D5CF]'
                            }`}
                          />
                          <span className={isPast ? 'text-[#111111] font-bold' : 'text-[#707070]'}>
                            {step.label}
                          </span>
                          {sIdx < TIMELINE_STEPS.length - 1 && (
                            <span className="text-[#D8D5CF]">→</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 h-48 sm:h-56 bg-[#F3F1EC] border border-[#D8D5CF] p-4 flex items-center justify-center">
                <img
                  src={latestBooking.car?.image}
                  alt=""
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* All Bookings Archive */}
        <div className="pt-8">
          <span className="text-xs font-mono tracking-widest text-[#707070] uppercase block mb-6 font-bold">
            HISTORICAL & UPCOMING RESERVATION ARCHIVE
          </span>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs uppercase text-[#707070]">
              Querying reservation records...
            </div>
          ) : bookings.length > 0 ? (
            <div className="divide-y divide-[#D8D5CF] border-t border-b border-[#D8D5CF]">
              {bookings.map((b, idx) => {
                const num = String(idx + 1).padStart(2, '0');
                const isExpanded = expandedId === b._id;
                const price = Number(b.price || 0);

                return (
                  <div key={b._id} className="py-6 transition-colors">
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : b._id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-baseline gap-6">
                        <span className="text-xs font-mono text-[#707070]">{num}</span>
                        <div>
                          <h4 className="text-xl sm:text-2xl font-editorial font-bold uppercase text-[#111111] group-hover:text-[#651F2A] transition-colors">
                            {b.car?.brand} {b.car?.model || b.car?.title || 'Luxury Chassis'}
                          </h4>
                          <span className="text-xs font-mono text-[#707070]">
                            {new Date(b.pickupDate).toLocaleDateString()} — {new Date(b.returnDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 font-mono text-xs">
                        <span className="font-bold text-[#111111]">
                          {currency}{price.toLocaleString()}
                        </span>
                        <span
                          className={`px-2.5 py-1 text-[9px] uppercase font-bold border ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : b.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-[#707070] group-hover:text-[#111111]">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-[#D8D5CF] bg-white p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
                        <div>
                          <span className="text-[#707070] block mb-1">RESERVATION ID</span>
                          <span className="font-bold">{b._id}</span>
                        </div>
                        <div>
                          <span className="text-[#707070] block mb-1">PICKUP LOCATION</span>
                          <span className="font-bold">{b.car?.location || 'Delhi NCR Terminal 3'}</span>
                        </div>
                        <div className="flex items-center justify-start sm:justify-end gap-3">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(b._id)}
                              disabled={cancellingId === b._id}
                              className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 uppercase font-bold cursor-pointer"
                            >
                              {cancellingId === b._id ? 'CANCELING...' : 'CANCEL RESERVATION'}
                            </button>
                          )}
                          <Link
                            to={`/car/${b.car?._id}`}
                            className="px-4 py-2 bg-[#111111] text-white uppercase font-bold"
                          >
                            VIEW VEHICLE SPEC
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center border border-[#D8D5CF] bg-white p-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#707070] block mb-2">
                NO RESERVATION ARCHIVE
              </span>
              <p className="text-sm font-body text-[#707070] mb-6">
                Your driving log is currently empty.
              </p>
              <Link
                to="/cars"
                className="px-6 py-3 bg-[#111111] text-white text-xs font-mono uppercase font-bold inline-block"
              >
                SELECT A VEHICLE
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;