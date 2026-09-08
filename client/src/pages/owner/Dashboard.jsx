import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {
  DollarSign, Car, Clock, CheckCircle2,
  TrendingUp, Download, BarChart3
} from 'lucide-react';

const WEEKLY_DATA = [
  { day: 'Mon', revenue: 24000, bookings: 3 },
  { day: 'Tue', revenue: 38000, bookings: 5 },
  { day: 'Wed', revenue: 42000, bookings: 6 },
  { day: 'Thu', revenue: 51000, bookings: 7 },
  { day: 'Fri', revenue: 76000, bookings: 10 },
  { day: 'Sat', revenue: 94000, bookings: 12 },
  { day: 'Sun', revenue: 82000, bookings: 11 },
];

const Dashboard = () => {
  const { axios, currency, cars } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('revenue');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/owner/dashboard');
      if (res.data?.success && res.data?.dashboardData) {
        setData(res.data.dashboardData);
        return;
      }
    } catch (apiErr) {
      console.warn("Dashboard API:", apiErr.message);
    }

    // Fallback
    setData({
      totalCars: cars?.length || 0,
      totalBookings: 0,
      pendingBookings: 0,
      completedBookings: 0,
      monthlyRevenue: 0,
      recentBookings: [],
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [cars]);

  useEffect(() => {
    if (data !== null) setLoading(false);
  }, [data]);

  const handleExportCsv = () => {
    if (!data?.recentBookings?.length) {
      toast.error('No data to export');
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Booking ID,Customer,Vehicle,From,To,Amount,Status'].join(',') +
      '\n' +
      data.recentBookings
        .map(
          (b) =>
            `${b._id},${b.user?.name || 'Guest'},${b.car?.title || 'Car'},${b.pickupDate},${b.returnDate},${b.totalPrice},${b.status}`
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `carrental_bookings_${Date.now()}.csv`;
    a.click();
    toast.success('Bookings exported');
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border border-white/20 border-t-[#C5A880] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B]">Loading club telematics...</p>
      </div>
    );
  }

  const maxWeekly = Math.max(...WEEKLY_DATA.map(d => chartView === 'revenue' ? d.revenue : d.bookings));

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 text-[#F4F2ED] font-mono select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/14">
        <div>
          <span className="text-[10px] text-[#C5A880] uppercase tracking-widest font-bold block mb-1">
            CONTROL TOWER // 2026
          </span>
          <h1 className="text-3xl font-display font-extrabold uppercase text-[#F4F2ED]">
            HOST DASHBOARD
          </h1>
          <p className="text-xs text-[#9B9B9B] mt-1">FLEET DISPATCH MATRIX & ALLOCATION METRICS</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="btn-club-outline text-[11px] py-2.5 px-4"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="REVENUE"
          value={`${currency}${(data.monthlyRevenue || 0).toLocaleString()}`}
          subtitle="Total confirmed revenue"
          trend="+12%"
          trendUp
        />
        <MetricCard
          icon={Car}
          label="VEHICLES"
          value={data.totalCars}
          subtitle="In your fleet"
        />
        <MetricCard
          icon={CheckCircle2}
          label="CONFIRMED"
          value={data.completedBookings || 0}
          subtitle="Completed allocations"
        />
        <MetricCard
          icon={Clock}
          label="PENDING"
          value={data.pendingBookings || 0}
          subtitle="Awaiting dispatch"
          warning={data.pendingBookings > 0}
        />
      </div>

      {/* Chart */}
      <div className="bg-[#141414] border border-white/14 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] text-[#C5A880] uppercase tracking-widest block">TELEMETRY GRAPH</span>
            <h3 className="text-lg font-display font-bold uppercase text-[#F4F2ED]">WEEKLY PERFORMANCE</h3>
          </div>
          <div className="flex items-center gap-1 bg-[#1B1B1B] border border-white/10 p-1 text-xs">
            <button
              onClick={() => setChartView('revenue')}
              className={`px-3 py-1 uppercase text-[10px] tracking-wider transition-colors ${
                chartView === 'revenue' ? 'bg-[#F4F2ED] text-[#0B0B0B] font-bold' : 'text-[#9B9B9B] hover:text-white'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setChartView('bookings')}
              className={`px-3 py-1 uppercase text-[10px] tracking-wider transition-colors ${
                chartView === 'bookings' ? 'bg-[#F4F2ED] text-[#0B0B0B] font-bold' : 'text-[#9B9B9B] hover:text-white'
              }`}
            >
              Bookings
            </button>
          </div>
        </div>

        {/* Bar Chart Bars */}
        <div className="flex items-end justify-between gap-3 h-48 pt-4 border-b border-white/10">
          {WEEKLY_DATA.map((item) => {
            const val = chartView === 'revenue' ? item.revenue : item.bookings;
            const heightPct = maxWeekly ? (val / maxWeekly) * 100 : 10;
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[9px] text-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity">
                  {chartView === 'revenue' ? `${currency}${(val / 1000).toFixed(0)}k` : val}
                </div>
                <div
                  className="w-full bg-[#1B1B1B] border border-white/14 group-hover:bg-[#C5A880] transition-colors"
                  style={{ height: `${Math.max(8, heightPct)}%` }}
                />
                <span className="text-[10px] text-[#9B9B9B]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Allocations Table */}
      <div className="bg-[#141414] border border-white/14 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h3 className="text-base font-display font-bold uppercase text-[#F4F2ED]">
            RECENT DISPATCHES
          </h3>
          <span className="text-xs text-[#9B9B9B]">
            {data.recentBookings?.length || 0} TOTAL RECORDED
          </span>
        </div>

        {!data.recentBookings?.length ? (
          <div className="py-12 text-center text-xs text-[#9B9B9B] uppercase">
            No recent allocations recorded in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[#6E6E6E] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-2">CUSTOMER</th>
                  <th className="py-3 px-2">VEHICLE</th>
                  <th className="py-3 px-2">DATES</th>
                  <th className="py-3 px-2">TARIFF</th>
                  <th className="py-3 px-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#1B1B1B]/40 transition-colors">
                    <td className="py-3 px-2 text-[#F4F2ED] font-bold">{b.user?.name || 'Guest Pilot'}</td>
                    <td className="py-3 px-2 text-[#9B9B9B]">{b.car?.title || b.car?.model || 'Vehicle'}</td>
                    <td className="py-3 px-2 text-[#6E6E6E]">
                      {new Date(b.pickupDate).toLocaleDateString()} — {new Date(b.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-bold text-[#F4F2ED]">{currency}{Number(b.totalPrice || 0).toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="px-2 py-0.5 border border-[#C5A880]/40 text-[#C5A880] text-[9px] uppercase">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, subtitle, trend, trendUp, warning }) => (
  <div className="bg-[#141414] border border-white/14 p-5 flex flex-col justify-between">
    <div className="flex items-center justify-between text-[#9B9B9B] mb-3">
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
      <Icon className={`w-4 h-4 ${warning ? 'text-amber-400' : 'text-[#C5A880]'}`} />
    </div>
    <div>
      <div className="text-2xl font-display font-bold text-[#F4F2ED] uppercase">{value}</div>
      <div className="flex items-center justify-between text-[10px] text-[#6E6E6E] mt-1">
        <span>{subtitle}</span>
        {trend && (
          <span className={trendUp ? 'text-emerald-400' : 'text-red-400'}>{trend}</span>
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;