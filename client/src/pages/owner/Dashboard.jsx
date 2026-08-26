import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { DollarSign, Car, Calendar, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { axios, currency } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/owner/dashboard');
      if (res.data.success) {
        setData(res.data.dashboardData);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-10 text-slate-400 font-mono">Loading telemetry dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl flex flex-col gap-8">
      {/* Title */}
      <div>
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">FLEET ANALYTICS</span>
        <h1 className="text-3xl font-black text-white">Owner Command Center</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono uppercase">Monthly Revenue</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {currency}
            {data?.monthlyRevenue || 0}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> Confirmed bookings
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-purple-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono uppercase">Listed Supercars</span>
            <Car className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{data?.totalCars || 0}</p>
          <span className="text-[10px] text-slate-400 font-mono">Active in fleet</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono uppercase">Pending Requests</span>
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{data?.pendingBookings || 0}</p>
          <span className="text-[10px] text-amber-300 font-mono">Awaiting approval</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-mono uppercase">Completed Rentals</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{data?.completedBookings || 0}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Fulfilled rentals</span>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white font-sans">Recent Fleet Reservations</h3>

        {data?.recentBookings?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Pickup Date</th>
                  <th className="pb-3">Return Date</th>
                  <th className="pb-3">Total Earnings</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {data.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 flex items-center gap-2">
                      <img src={b.car?.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <span className="font-bold text-white">{b.car?.title || 'Supercar Spec'}</span>
                    </td>
                    <td className="py-3.5 text-slate-300">{new Date(b.pickupDate).toLocaleDateString()}</td>
                    <td className="py-3.5 text-slate-300">{new Date(b.returnDate).toLocaleDateString()}</td>
                    <td className="py-3.5 text-cyan-400 font-bold">
                      {currency}
                      {b.price}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border border-cyan-500/40 text-cyan-300 bg-cyan-500/10">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-mono py-4">No recent reservations recorded.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
