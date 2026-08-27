import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Sparkles, Search, Car, User as UserIcon, LogOut, Menu, X, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        navigate('/owner');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Cars', path: '/cars' },
    { name: 'My Bookings', path: '/my-bookings' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-nav transition-all duration-300 border-b border-cyan-500/10 px-4 md:px-12 lg:px-20 py-3.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                VELOCITY
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase block -mt-1">
              3D MOBILITY PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Owner Dashboard or Upgrade */}
          <button
            onClick={() => (isOwner ? navigate('/owner') : changeRole())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/30 text-purple-200 hover:border-purple-400/60 hover:text-white transition-all shadow-lg hover:shadow-purple-500/20 cursor-pointer"
          >
            {isOwner ? (
              <>
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Owner Dashboard</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>Host Your Car</span>
              </>
            )}
          </button>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-cyan-500/30 pl-3 pr-2 py-1.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs font-bold uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{user.name}</p>
                  <span className="text-[10px] text-cyan-400 font-mono capitalize">{user.role}</span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-3 p-4 glass-card rounded-2xl border border-cyan-500/20 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setOpen(false);
                isOwner ? navigate('/owner') : changeRole();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-purple-600/30 text-purple-200 border border-purple-500/40 text-center"
            >
              {isOwner ? 'Owner Dashboard' : 'Host Your Car'}
            </button>
            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 text-center"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowLogin(true);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 font-bold text-center"
              >
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
