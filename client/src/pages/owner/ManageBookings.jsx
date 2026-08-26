import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

const ManageBookings = () => {
  const { axios, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/owner');
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

  const changeStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
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
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">RESERVATION TELEMETRY</span>
        <h1 className="text-3xl font-black text-white">Manage Fleet Bookings ({bookings.length})</h1>
      </div>

      {loading ? (
        <div className="p-10 text-slate-400 font-mono">Loading reservation logs...</div>
      ) : bookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img src={b.car?.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                <div>
                  <h3 className="text-base font-bold text-white">{b.car?.title || 'Supercar Spec'}</h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    Renter: {b.user?.name} ({b.user?.email})
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                    <span>From: {new Date(b.pickupDate).toLocaleDateString()}</span>
                    <span>To: {new Date(b.returnDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Payout</p>
                  <p className="text-lg font-black text-cyan-400 font-mono">
                    {currency}
                    {b.price}
                  </p>
                </div>

                {/* Status Controls */}
                <div className="flex items-center gap-2">
                  {b.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => changeStatus(b._id, 'confirmed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-500/30"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </button>
                      <button
                        onClick={() => changeStatus(b._id, 'cancelled')}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-500/30"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border capitalize ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {b.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center glass-card rounded-3xl border border-white/10 my-4">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-bold">No booking requests found</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
