import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import toast from 'react-hot-toast';
import { 
  DollarSign, 
  Car, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  Download, 
  ArrowUpRight,
  ShieldCheck
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
  const { axios, currency } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('revenue'); // 'revenue' or 'bookings'

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/owner/dashboard');
      if (res.data?.success) {
        setData(res.data.dashboardData);
      } else {
        toast.error(res.data?.message || 'Failed to load dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExportCsv = () => {
    if (!data?.recentBookings?.length) {
      toast.error('No reservation data to export');
      return;
    }
    const headers = 'ID,Vehicle,PickupDate,ReturnDate,Price,Status\n';
    const rows = data.recentBookings.map(b => 
      `"${b._id}","${b.car?.title || 'Luxury Spec'}","${b.pickupDate}","${b.returnDate}","${b.price}","${b.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TERACAR_Fleet_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Fleet report downloaded successfully');
  };

  if (loading) {
    return <div className="p-10 text-xs font-mono tracking-widest text-[#7A5244] uppercase">Loading dashboard telemetry...</div>;
  }

  const maxVal = chartView === 'revenue' 
    ? Math.max(...WEEKLY_DATA.map(d => d.revenue)) 
    : Math.max(...WEEKLY_DATA.map(d => d.bookings));

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 text-[#2B1B14]">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Title 
          title="Fleet Analytics & Operations" 
          subTitle="Live telemetry, revenue allocations, and active reservation fulfillment." 
        />
        <button
          onClick={handleExportCsv}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F7F3EE] border border-[#E6DFD5] rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#2B1B14] transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-[#5C3A2E]" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Revenue Metric */}
        <div className="p-6 bg-white border border-[#E6DFD5] hover:border-[#5C3A2E] rounded-2xl flex flex-col gap-3 shadow-[0_4px_24px_rgba(43,27,20,0.03)] transition-all">
          <div className="flex items-center justify-between text-[#7A5244]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-[#5C3A2E]" />
          </div>
          <p className="text-3xl font-black text-[#2B1B14] font-mono leading-none flex items-baseline gap-0.5">
            <span className="text-sm font-bold text-[#5C3A2E]">{currency}</span>
            <span>{data?.monthlyRevenue || 0}</span>
          </p>
          <span className="text-[10px] text-[#7A5244] flex items-center gap-1.5 font-mono uppercase tracking-wider pt-2 border-t border-[#E6DFD5] font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +18.4% vs last month
          </span>
        </div>

        {/* Cars Metric */}
        <div className="p-6 bg-white border border-[#E6DFD5] hover:border-[#5C3A2E] rounded-2xl flex flex-col gap-3 shadow-[0_4px_24px_rgba(43,27,20,0.03)] transition-all">
          <div className="flex items-center justify-between text-[#7A5244]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Active Fleet</span>
            <Car className="w-4 h-4 text-[#5C3A2E]" />
          </div>
          <p className="text-3xl font-black text-[#2B1B14] font-mono leading-none">
            {data?.totalCars || 0}
          </p>
          <span className="text-[10px] text-[#7A5244] font-mono uppercase tracking-wider pt-2 border-t border-[#E6DFD5] font-semibold">
            100% telemetry online
          </span>
        </div>

        {/* Pending Metric */}
        <div className="p-6 bg-white border border-[#E6DFD5] hover:border-[#5C3A2E] rounded-2xl flex flex-col gap-3 shadow-[0_4px_24px_rgba(43,27,20,0.03)] transition-all">
          <div className="flex items-center justify-between text-[#7A5244]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Pending Dispatches</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-[#2B1B14] font-mono leading-none">
            {data?.pendingBookings || 0}
          </p>
          <span className="text-[10px] text-[#7A5244] font-mono uppercase tracking-wider pt-2 border-t border-[#E6DFD5] font-semibold">
            Awaiting key dispatch
          </span>
        </div>

        {/* Completed Metric */}
        <div className="p-6 bg-white border border-[#E6DFD5] hover:border-[#5C3A2E] rounded-2xl flex flex-col gap-3 shadow-[0_4px_24px_rgba(43,27,20,0.03)] transition-all">
          <div className="flex items-center justify-between text-[#7A5244]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Completed Rentals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-[#2B1B14] font-mono leading-none">
            {data?.completedBookings || 0}
          </p>
          <span className="text-[10px] text-[#7A5244] font-mono uppercase tracking-wider pt-2 border-t border-[#E6DFD5] font-semibold">
            Fulfilled reservations
          </span>
        </div>
      </div>

      {/* Revenue & Dispatch SVG Trend Chart */}
      <div className="p-6 md:p-8 bg-white border border-[#E6DFD5] rounded-3xl flex flex-col gap-6 shadow-[0_4px_24px_rgba(43,27,20,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2B1B14]">
              Weekly Revenue & Dispatch Velocity
            </h3>
            <p className="text-[10px] font-mono text-[#7A5244] uppercase tracking-wider font-semibold">
              Live Fleet Performance Trends
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F7F3EE] p-1 rounded-xl border border-[#E6DFD5]">
            <button
              onClick={() => setChartView('revenue')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer font-bold ${
                chartView === 'revenue' ? 'bg-[#2B1B14] text-white shadow-xs' : 'text-[#7A5244] hover:text-[#2B1B14]'
              }`}
            >
              Revenue ({currency})
            </button>
            <button
              onClick={() => setChartView('bookings')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer font-bold ${
                chartView === 'bookings' ? 'bg-[#2B1B14] text-white shadow-xs' : 'text-[#7A5244] hover:text-[#2B1B14]'
              }`}
            >
              Bookings Count
            </button>
          </div>
        </div>

        {/* SVG Visual Bars */}
        <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-48 pt-6 pb-2">
          {WEEKLY_DATA.map((item) => {
            const val = chartView === 'revenue' ? item.revenue : item.bookings;
            const heightPercent = Math.round((val / maxVal) * 100);
            return (
              <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[9px] font-mono font-bold text-[#5C3A2E] opacity-0 group-hover:opacity-100 transition-opacity">
                  {chartView === 'revenue' ? `${currency}${val}` : val}
                </span>
                <div className="w-full bg-[#F7F3EE] rounded-xl h-full flex items-end overflow-hidden border border-[#E6DFD5]">
                  <div
                    className="w-full bg-gradient-to-t from-[#2B1B14] to-[#5C3A2E] rounded-t-xl transition-all duration-500 group-hover:from-[#5C3A2E] group-hover:to-[#B98B73]"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7A5244] uppercase tracking-wider">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="p-6 md:p-8 bg-white border border-[#E6DFD5] rounded-3xl flex flex-col gap-6 shadow-[0_4px_24px_rgba(43,27,20,0.03)]">
        <h3 className="text-xs font-bold text-[#2B1B14] font-mono uppercase tracking-[0.2em]">Recent Fleet Reservations</h3>

        {data?.recentBookings?.length > 0 ? (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E6DFD5] text-[#7A5244]">
                  <th className="pb-3 text-[10px] font-mono tracking-wider uppercase font-semibold">Vehicle</th>
                  <th className="pb-3 text-[10px] font-mono tracking-wider uppercase font-semibold">Pickup Date</th>
                  <th className="pb-3 text-[10px] font-mono tracking-wider uppercase font-semibold">Return Date</th>
                  <th className="pb-3 text-[10px] font-mono tracking-wider uppercase font-semibold">Earnings</th>
                  <th className="pb-3 text-[10px] font-mono tracking-wider uppercase font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD5] text-[#2B1B14]">
                {data.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#F7F3EE] transition-colors group">
                    <td className="py-4 flex items-center gap-3.5">
                      <div className="w-14 h-9 bg-[#F7F3EE] border border-[#E6DFD5] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                        <img src={b.car?.image} className="w-full h-full object-contain" alt="" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wide">{b.car?.title || 'Luxury Spec'}</span>
                    </td>
                    <td className="py-4 text-xs font-mono text-[#5C3A2E] uppercase">{new Date(b.pickupDate).toLocaleDateString()}</td>
                    <td className="py-4 text-xs font-mono text-[#5C3A2E] uppercase">{new Date(b.returnDate).toLocaleDateString()}</td>
                    <td className="py-4 text-xs font-black font-mono">
                      <span className="text-[10px] text-[#5C3A2E] mr-0.5">{currency}</span>
                      {b.price}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-[9px] font-mono tracking-wider border rounded-lg uppercase font-bold ${
                        b.status === 'confirmed' ? 'text-emerald-800 border-emerald-300 bg-emerald-50' :
                        b.status === 'cancelled' ? 'text-rose-700 border-rose-200 bg-rose-50' :
                        'text-amber-800 border-amber-300 bg-amber-50'
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
          <div className="py-10 text-center flex flex-col items-center gap-2">
            <span className="text-xs text-[#7A5244] font-mono uppercase tracking-wider">No recent reservations recorded.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;