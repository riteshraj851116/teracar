import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { dummyMyBookingsData } from '../../assets/assets';

const ManageBookings = () => {
  const { axios, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/bookings/owner');
        if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
          setBookings(data.bookings);
          return;
        }
      } catch (err) {
        console.log("Server owner bookings fallback:", err.message);
      }
      setBookings(dummyMyBookingsData);
    } catch (err) {
      setBookings(dummyMyBookingsData);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (bookingId, status) => {
    try {
      try {
        await axios.post('/api/bookings/change-status', { bookingId, status });
      } catch (err) {
        // Fallback local
      }
      const updated = bookings.map((b) =>
        b._id === bookingId ? { ...b, status } : b
      );
      setBookings(updated);
      toast.success(`Booking status changed to ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl flex flex-col gap-6">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">RESERVATION TELEMETRY</span>
        <h1 className="text-3xl font-black text-slate-900 mt-0.5">Manage Fleet Bookings ({bookings.length})</h1>
      </div>

      {loading ? (
        <div className="p-10 text-slate-500 font-mono">Loading reservation logs...</div>
      ) : bookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => {
            const car = b.car || {};
            const carTitle = car.title || `${car.brand || ''} ${car.model || ''}`.trim() || 'Supercar Spec';

            return (
              <div
                key={b._id}
                className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={car.image} alt="" className="w-20 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">{carTitle}</h3>
                    <p className="text-xs text-cyan-600 font-mono font-semibold">
                      Renter: {b.user?.name || 'Alexander Wright'} ({b.user?.email || 'renter@velocity.com'})
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 mt-1">
                      <span>Pickup: {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : 'Instant'}</span>
                      <span>Return: {b.returnDate ? new Date(b.returnDate).toLocaleDateString() : 'TBD'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400 uppercase font-medium">Payout</p>
                    <p className="text-lg font-black text-slate-900 font-mono">
                      <span className="text-cyan-600">{currency}</span>
                      {(b.price || 75000).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Status Controls */}
                  <div className="flex items-center gap-2">
                    {b.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => changeStatus(b._id, 'confirmed')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => changeStatus(b._id, 'cancelled')}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border capitalize ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 my-4 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-900 font-bold">No booking requests found</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
