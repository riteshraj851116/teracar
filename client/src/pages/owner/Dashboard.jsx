import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {
  DollarSign, Car, Clock, CheckCircle2,
  TrendingUp, Download, BarChart3
} from 'lucide-react';

const WEEKLY_DATA = [
  { day: 'Mon', revenue: 2400, bookings: 3 },
  { day: 'Tue', revenue: 3800, bookings: 5 },
  { day: 'Wed', revenue: 4200, bookings: 6 },
  { day: 'Thu', revenue: 5100, bookings: 7 },
  { day: 'Fri', revenue: 7600, bookings: 10 },
  { day: 'Sat', revenue: 9400, bookings: 12 },
  { day: 'Sun', revenue: 8200, bookings: 11 },
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
    const headers = 'Vehicle,PickupDate,ReturnDate,Price,Status\n';
    const rows = data.recentBookings.map(b =>
      `"${b.car?.title || b.car?.brand || 'N/A'}","${b.pickupDate}","${b.returnDate}","${b.price}","${b.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carrental_bookings_${Date.now()}.csv`;
    a.click();
    toast.success('Bookings exported');
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  const maxWeekly = Math.max(...WEEKLY_DATA.map(d => chartView === 'revenue' ? d.revenue : d.bookings));

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-editorial">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Overview of your fleet and bookings</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="btn-outline px-4 py-2.5 text-sm rounded-lg"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Revenue"
          value={`${currency}${(data.monthlyRevenue || 0).toLocaleString()}`}
          subtitle="Total confirmed revenue"
          trend="+12%"
          trendUp
        />
        <MetricCard
          icon={Car}
          label="Vehicles"
          value={data.totalCars}
          subtitle="In your fleet"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Confirmed"
          value={data.completedBookings || 0}
          subtitle="Completed bookings"
        />
        <MetricCard
          icon={Clock}
          label="Pending"
          value={data.pendingBookings || 0}
          subtitle="Awaiting confirmation"
          warning={data.pendingBookings > 0}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Weekly Performance</h3>
            <p className="text-xs text-text-secondary mt-0.5">Revenue and booking trends</p>
          </div>
          <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-lg text-sm">
            <button
              onClick={() => setChartView('revenue')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                chartView === 'revenue' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setChartView('bookings')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                chartView === 'bookings' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Bookings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pb-2 border-b border-border">
          {WEEKLY_DATA.map((item) => {
            const val = chartView === 'revenue' ? item.revenue : item.bookings;
            const pct = Math.round((val / maxWeekly) * 100);
            return (
              <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-text-muted font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {chartView === 'revenue' ? `${currency}${val}` : val}
                </span>
                <div
                  className="w-full max-w-[36px] bg-accent/15 group-hover:bg-accent rounded-t transition-all duration-300"
                  style={{ height: `${Math.max(pct, 5)}%` }}
                />
                <span className="text-[10px] text-text-muted font-medium">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Recent Bookings</h3>

        {data.recentBookings?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-secondary uppercase">
                  <th className="py-3 px-3 font-medium">Vehicle</th>
                  <th className="py-3 px-3 font-medium">Dates</th>
                  <th className="py-3 px-3 font-medium">Amount</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-bg-secondary transition-colors">
                    <td className="py-3 px-3 font-medium text-text-primary">
                      {b.car?.title || b.car?.brand || 'Vehicle'}
                    </td>
                    <td className="py-3 px-3 text-text-secondary text-xs">
                      {new Date(b.pickupDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-text-primary">
                      {currency}{b.price?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`badge text-[10px] ${
                        b.status === 'confirmed' ? 'badge-success' : b.status === 'cancelled' ? 'badge-error' : 'badge-warning'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary py-8 text-center">No bookings yet</p>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, subtitle, trend, trendUp, warning }) => (
  <div className="bg-white rounded-xl border border-border p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${warning ? 'bg-warning/10' : 'bg-accent/8'}`}>
        <Icon className={`w-4 h-4 ${warning ? 'text-warning' : 'text-accent'}`} />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
    <div className="flex items-center gap-2 mt-1">
      <p className="text-xs text-text-muted">{subtitle}</p>
      {trend && (
        <span className={`text-[10px] font-semibold ${trendUp ? 'text-success' : 'text-error'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default Dashboard;