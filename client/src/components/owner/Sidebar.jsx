import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, Car, Calendar, Camera, Check } from 'lucide-react';

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const updateImage = async () => {
    if (!image) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data?.success) {
        await fetchUser();
        toast.success(data.message || 'Avatar updated');
        setImage('');
      } else {
        toast.error(data?.message || 'Avatar upload failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  const navLinks = [
    { name: 'Analytics', path: '/owner', icon: LayoutDashboard },
    { name: 'Add Vehicle', path: '/owner/add-car', icon: PlusCircle },
    { name: 'Manage Fleet', path: '/owner/manage-cars', icon: Car },
    { name: 'Reservations', path: '/owner/manage-bookings', icon: Calendar },
  ];

  return (
    <aside className="min-h-screen w-16 md:w-64 bg-white border-r border-[#e2e8f0] p-4 md:p-6 flex flex-col gap-6 text-[11px] font-mono tracking-wider shrink-0 transition-all shadow-[2px_0_12px_rgba(9,13,22,0.02)]">
      
      {/* Profile Section & Avatar Upload */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="relative group">
          <label htmlFor="owner-avatar" className="cursor-pointer block">
            <img
              src={image ? URL.createObjectURL(image) : user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300'}
              alt="Owner"
              className="w-10 h-10 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-[#090d16] p-0.5 transition-all group-hover:border-[#2563eb] shadow-xs"
            />
            <input
              type="file"
              id="owner-avatar"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute inset-0 bg-black/50 rounded-2xl hidden group-hover:flex items-center justify-center text-white backdrop-blur-xs transition-all">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </label>
        </div>

        {/* Avatar Save Button */}
        {image && (
          <button
            onClick={updateImage}
            disabled={uploading}
            className="px-3 py-1.5 bg-[#090d16] hover:bg-[#1e293b] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer uppercase text-[9px] shadow-sm"
          >
            <span>{uploading ? 'SAVING...' : 'SAVE'}</span>
            <Check className="w-3 h-3" />
          </button>
        )}

        {/* Profile Info */}
        <div className="hidden md:flex flex-col items-center text-center">
          <p className="text-xs font-black text-[#090d16] uppercase tracking-wider truncate max-w-[150px]">
            {user?.name || 'ADMIN'}
          </p>
          <span className="text-[10px] text-[#2563eb] mt-0.5 uppercase tracking-widest font-bold">VERIFIED HOST</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1.5 w-full pt-4 border-t border-[#e2e8f0]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/owner'}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive
                  ? 'bg-[#090d16] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#090d16] hover:bg-[#f8fafc]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#2563eb]'}`} />
              <span className="hidden md:inline uppercase tracking-wider">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
      
    </aside>
  );
};

export default Sidebar;