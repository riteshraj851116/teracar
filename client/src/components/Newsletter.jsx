import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, Mail, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed to VIP Telemetry Dispatch!');
    setEmail('');
  };

  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="p-8 md:p-12 rounded-3xl glass-card border border-cyan-500/20 text-center flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-white">Join The VIP Dispatch</h3>
        <p className="text-slate-400 text-xs md:text-sm max-w-md">
          Receive priority alerts for newly added limited-run supercars, exclusive track events, and member-only rental rates.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-2">
          <div className="relative w-full">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter executive email..."
              className="glass-input pl-10 pr-4 py-3 rounded-xl text-xs w-full outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs tracking-wider whitespace-nowrap hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>SUBSCRIBE</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
