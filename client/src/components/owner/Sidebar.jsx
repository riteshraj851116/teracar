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
        toast.error(data?.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { name: 'Add Vehicle', path: '/owner/add-car', icon: PlusCircle },
    { name: 'Manage Cars', path: '/owner/manage-cars', icon: Car },
    { name: 'Bookings', path: '/owner/manage-bookings', icon: Calendar },
  ];

  return (
    <aside className="min-h-screen w-16 md:w-64 bg-[#0B0B0B] border-r border-white/14 p-4 md:p-5 flex flex-col gap-6 shrink-0 transition-all text-[#F4F2ED]">
      
      {/* Profile */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="relative group">
          <label htmlFor="owner-avatar" className="cursor-pointer block">
            <img
              src={image ? URL.createObjectURL(image) : user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300'}
              alt="Profile"
              className="w-10 h-10 md:w-14 md:h-14 object-cover border border-white/20 transition-all group-hover:border-[#C5A880]"
            />
            <input
              type="file"
              id="owner-avatar"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </label>
        </div>

        {image && (
          <button
            onClick={updateImage}
            disabled={uploading}
            className="btn-club-primary px-3 py-1.5 text-[10px]"
          >
            {uploading ? 'SAVING...' : 'SAVE AVATAR'}
          </button>
        )}

        <div className="text-center hidden md:block">
          <span className="text-sm font-bold text-[#F4F2ED] uppercase tracking-wide block">
            {user?.name || 'Administrator'}
          </span>
          <span className="text-[10px] font-mono text-[#9B9B9B] uppercase tracking-widest block mt-0.5">
            CLUB HOST LIAISON
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-white/10 my-1" />

      {/* Nav links */}
      <nav className="flex flex-col gap-1.5 flex-1 font-mono text-xs">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/owner'}
              className={`flex items-center gap-3 px-3.5 py-3 transition-colors ${
                isActive
                  ? 'bg-[#141414] text-[#C5A880] border-l-2 border-[#C5A880] font-bold'
                  : 'text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#141414]/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline uppercase tracking-wider">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;