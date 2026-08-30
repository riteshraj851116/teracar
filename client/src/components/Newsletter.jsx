import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Check } from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    playUiClick();
    toast.success('Subscribed to VIP Atelier Dispatch');
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        
        <div className="flex flex-col gap-1 max-w-lg">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B]">
            VIP ATELIER DISPATCH
          </span>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#090D16] font-editorial">
            Early Access Fleet Releases
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Receive priority notifications for limited allocations, track-spec deliveries, and bespoke private rates.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row items-stretch w-full max-w-md gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER CLIENT EMAIL..."
            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-4 py-3 text-xs font-mono text-[#090D16] placeholder:text-[#94A3B8] outline-none focus:border-[#090D16]"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            {submitted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Joined</span>
              </>
            ) : (
              <>
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
        
      </div>
    </section>
  );
};

export default Newsletter;