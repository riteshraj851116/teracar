import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { DollarSign, Car, Calendar, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { dummyDashboardData } from '../../assets/assets';

const Dashboard = () => {
  const { axios, currency, cars } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/owner/dashboard');
      if (res.data.success && res.data.dashboardData) {
        setData(res.data.dashboardData);
      } else {
        setData({
          ...dummyDashboardData,
          totalCars: cars.length || 12,
        });
      }
    } catch (err) {
      setData({
        ...dummyDashboardData,
        totalCars: cars.length || 12,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [cars]);

  if (loading) {
    return <div className="p-10 text-slate-500 font-mono">Loading telemetry dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl flex flex-col gap-8">
      {/* Title */}
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">FLEET ANALYTICS & REVENUE</span>
        <h1 className="text-3xl font-black text-slate-900 mt-0.5">Owner Command Center</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between text-cyan-600">
            <span className="text-xs font-mono uppercase font-bold text-slate-500">Monthly Revenue</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            <span className="text-cyan-600">{currency}</span>
            {(data?.monthlyRevenue || 560000).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-mono font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last cycle
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-mono uppercase font-bold text-slate-500">Fleet Vehicles</span>
            <Car className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{data?.totalCars || cars.length || 12}</p>
          <span className="text-[11px] text-slate-500 font-mono">Active in fleet</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-mono uppercase font-bold text-slate-500">Pending Requests</span>
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{data?.pendingBookings || 1}</p>
          <span className="text-[11px] text-amber-600 font-mono font-semibold">Awaiting host approval</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-mono uppercase font-bold text-slate-500">Completed Rentals</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{data?.completedBookings || 2}</p>
          <span className="text-[11px] text-emerald-600 font-mono font-semibold">Fulfilled reservations</span>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
        <h3 className="text-lg font-black text-slate-900">Recent Fleet Reservations</h3>

        {data?.recentBookings?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3 font-semibold">Vehicle</th>
                  <th className="pb-3 font-semibold">Pickup Date</th>
                  <th className="pb-3 font-semibold">Return Date</th>
                  <th className="pb-3 font-semibold">Total Revenue</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 flex items-center gap-3">
                      <img src={b.car?.image} className="w-10 h-8 rounded-lg object-cover border border-slate-200" alt="" />
                      <span className="font-bold text-slate-900">{b.car?.title || `${b.car?.brand || ''} ${b.car?.model || ''}`}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : 'Instant'}</td>
                    <td className="py-3.5 text-slate-600">{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : 'TBD'}</td>
                    <td className="py-3.5 text-slate-900 font-bold">
                      <span className="text-cyan-600">{currency}</span>
                      {(b.price || 75000).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border border-emerald-200 text-emerald-700 bg-emerald-50">
                        {b.status || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono py-4">No recent reservations recorded.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
