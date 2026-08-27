import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, Car, Calendar, Camera, Check } from 'lucide-react';

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { name: 'Add Car', path: '/owner/add-car', icon: PlusCircle },
    { name: 'Manage Cars', path: '/owner/manage-cars', icon: Car },
    { name: 'Manage Bookings', path: '/owner/manage-bookings', icon: Calendar },
  ];

  return (
    <aside className="min-h-screen w-16 md:w-64 glass-card border-r border-cyan-500/10 p-4 flex flex-col gap-6 text-xs font-mono shrink-0">
      {/* Profile Image & Upload */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="relative group">
          <label htmlFor="owner-avatar" className="cursor-pointer block">
            <img
              src={image ? URL.createObjectURL(image) : user?.image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300'}
              alt="Owner"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20"
            />
            <input
              type="file"
              id="owner-avatar"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute inset-0 bg-black/60 rounded-full hidden group-hover:flex items-center justify-center text-cyan-300">
              <Camera className="w-4 h-4" />
            </div>
          </label>
        </div>

        {image && (
          <button
            onClick={updateImage}
            className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Save</span>
            <Check className="w-3 h-3" />
          </button>
        )}

        <div className="hidden md:block text-center">
          <p className="text-sm font-bold text-white font-sans truncate max-w-[140px]">{user?.name}</p>
          <span className="text-[10px] text-cyan-400">FLEET HOST</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 w-full pt-4 border-t border-white/10">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/owner'}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden md:inline font-sans">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
