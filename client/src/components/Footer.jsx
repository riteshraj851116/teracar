import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-[#F3F1EC] pt-24 pb-12 border-t border-[#D8D5CF]/20" aria-label="Site footer">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Massive Editorial CTA */}
        <div className="pb-20 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <div>
            <span className="text-xs font-mono tracking-widest text-white/50 uppercase block mb-4">
              07 / CONCLUSION
            </span>
            <h2 className="text-5xl sm:text-7xl lg:text-9xl font-editorial font-bold tracking-tighter uppercase leading-[0.88] text-white">
              READY TO<br />
              <span className="text-white/40 hover:text-[#651F2A] transition-colors duration-500">MOVE?</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4">
            <p className="text-xs font-mono text-white/60 uppercase tracking-widest max-w-xs leading-relaxed">
              Available 24/7 across primary metropolitan hubs. Instant confirmation and direct airfield dispatch.
            </p>
            <Link
              to="/cars"
              data-cursor="book"
              data-cursor-text="BOOK"
              className="px-8 py-5 bg-[#651F2A] hover:bg-white hover:text-[#111111] text-white text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-4 transition-all duration-300 shadow-xl"
            >
              <span>BOOK A CAR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Editorial Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/10 text-xs font-mono">
          
          {/* Col 1 */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-4">
              FLEET DIRECTORY
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              {['Supercars', 'Luxury Saloons', 'Flagship SUVs', 'Track Heritage', 'Electric GT'].map((cat) => (
                <li key={cat}>
                  <Link to="/cars" className="text-white/70 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-4">
              METROPOLITAN HUBS
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Goa', 'Jaipur', 'Hyderabad'].map((city) => (
                <li key={city}>
                  <Link to={`/cars?location=${encodeURIComponent(city)}`} className="text-white/70 hover:text-white transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-4">
              SERVICES
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              <li><Link to="/my-bookings" className="text-white/70 hover:text-white transition-colors">My Journeys</Link></li>
              <li><Link to="/wishlist" className="text-white/70 hover:text-white transition-colors">Saved Vehicles</Link></li>
              <li><a href="#offers" className="text-white/70 hover:text-white transition-colors">Weekend Privileges</a></li>
              <li><Link to="/owner" className="text-white/70 hover:text-white transition-colors">Host Fleet</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-4">
              CHANNELS
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">INSTAGRAM <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">YOUTUBE <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">LINKEDIN <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">JOURNAL <ArrowUpRight className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div>
            CAR RENTAL © {currentYear} // ALL RIGHTS RESERVED
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-white transition-colors">CONCIERGE CONTACT</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;