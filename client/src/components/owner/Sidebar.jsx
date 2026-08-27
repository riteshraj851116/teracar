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
      toast.success('Avatar updated');
      setImage('');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { name: 'Add Supercar', path: '/owner/add-car', icon: PlusCircle },
    { name: 'Manage Cars', path: '/owner/manage-cars', icon: Car },
    { name: 'Manage Bookings', path: '/owner/manage-bookings', icon: Calendar },
  ];

  return (
    <aside className="min-h-screen w-16 md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-6 text-xs font-mono shrink-0 shadow-sm">
      {/* Profile Image & Upload */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="relative group">
          <label htmlFor="owner-avatar" className="cursor-pointer block">
            <img
              src={image ? URL.createObjectURL(image) : user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300'}
              alt="Owner"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            />
            <input
              type="file"
              id="owner-avatar"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute inset-0 bg-black/40 rounded-full hidden group-hover:flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
          </label>
        </div>

        {image && (
          <button
            onClick={updateImage}
            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <span>Save</span>
            <Check className="w-3 h-3" />
          </button>
        )}

        <div className="hidden md:block text-center">
          <p className="text-sm font-bold text-slate-900 font-sans truncate max-w-[140px]">{user?.name || 'Alexander Wright'}</p>
          <span className="text-[10px] text-cyan-600 font-bold">FLEET HOST</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1.5 w-full pt-4 border-t border-slate-100">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/owner'}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-slate-900 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="hidden md:inline font-sans font-medium">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
