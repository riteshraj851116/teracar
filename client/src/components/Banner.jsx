import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Clock, ArrowRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { playUiClick } from '../utils/audioEngine';

const Banner = () => {
  const { navigate, isOwner, setIsOwner, axios, user, setShowLogin, fetchUser } = useAppContext();

  const handleHostClick = async () => {
    playUiClick();
    if (!user) {
      toast.error('Please sign in to register your vehicle');
      setShowLogin(true);
      return;
    }

    if (isOwner) {
      navigate('/owner');
    } else {
      try {
        const { data } = await axios.post('/api/owner/change-role');
        if (data?.success) {
          setIsOwner(true);
          await fetchUser();
          toast.success(data.message || 'Owner privileges activated');
          navigate('/owner');
        } else {
          toast.error(data?.message || 'Failed to upgrade account');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Something went wrong');
      }
    }
  };

  return (
    <section className="py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="bg-[#090D16] text-white p-8 md:p-12 rounded-lg border border-[#1E293B] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 self-start bg-white/10 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-widest text-[#94A3B8]">
              <span>ATELIER HOSTING PROGRAM</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight font-editorial leading-tight">
              Monetize Your High-End Chassis.<br />
              <span className="text-[#94A3B8] font-light italic font-serif-luxury lowercase">
                with institutional-grade asset security.
              </span>
            </h2>

            <p className="text-[#94A3B8] text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              Consign your vehicle into the TERACAR private network. Comprehensive $2M insurance, verified drivers, zero admin burden, and automated bi-weekly earnings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[10px] font-mono uppercase text-[#CBD5E1]">
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                <span>$2M Insurance Bond</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
                <Clock className="w-3.5 h-3.5 text-white shrink-0" />
                <span>24/7 Telemetry Guard</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
                <Zap className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Automated Payouts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={handleHostClick}
              className="flex items-center gap-4 px-6 py-4 bg-white hover:bg-[#F1F5F9] text-[#090D16] rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              <span>{isOwner ? 'Owner Dashboard' : 'Consign Vehicle'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Banner;