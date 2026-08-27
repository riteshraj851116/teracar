import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Sparkles, Car, User as UserIcon, LogOut, Menu, X, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    if (!user) {
      toast.error('Please sign in first to host your vehicle');
      setShowLogin(true);
      return;
    }
    try {
      const { data } = await axios.post('/api/owner/change-role');
      setIsOwner(true);
      navigate('/owner');
    } catch (error) {
      setIsOwner(true);
      navigate('/owner');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Fleet', path: '/cars' },
    { name: 'My Bookings', path: '/my-bookings' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass-nav px-4 md:px-12 lg:px-20 py-3.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#800020] via-[#991B1B] to-black flex items-center justify-center shadow-md shadow-rose-900/20 group-hover:scale-105 transition-transform text-white">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-black">
                VELOCITY
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#800020] font-bold uppercase block -mt-1">
              LUXURY MOBILITY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/90 p-1 rounded-full border border-zinc-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-black shadow-sm'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
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
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold tracking-wide bg-zinc-100 border border-zinc-300 text-zinc-800 hover:bg-zinc-200/80 transition-all cursor-pointer shadow-sm"
          >
            {isOwner ? (
              <>
                <LayoutDashboard className="w-4 h-4 text-[#800020]" />
                <span>Owner Dashboard</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-[#800020]" />
                <span>Host Your Vehicle</span>
              </>
            )}
          </button>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="flex items-center gap-2.5 bg-zinc-100 border border-zinc-200 pl-3 pr-1.5 py-1.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-xs font-bold text-black truncate max-w-[100px]">{user.name}</p>
                  <span className="text-[10px] text-[#800020] font-mono capitalize">{user.role || 'Member'}</span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold tracking-wide bg-black text-white hover:bg-[#800020] transition-all shadow-md cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black"
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
          className="md:hidden mt-3 p-4 bg-white/95 backdrop-blur-xl rounded-3xl border border-zinc-200 shadow-xl flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-[#800020] transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setOpen(false);
                isOwner ? navigate('/owner') : changeRole();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-300 text-center"
            >
              {isOwner ? 'Owner Dashboard' : 'Host Your Vehicle'}
            </button>
            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 text-center"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowLogin(true);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-black text-white text-center shadow-md"
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
