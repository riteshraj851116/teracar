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
    <aside className="min-h-screen w-16 md:w-64 bg-white border-r border-border p-4 md:p-5 flex flex-col gap-6 shrink-0 transition-all">

      {/* Profile */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="relative group">
          <label htmlFor="owner-avatar" className="cursor-pointer block">
            <img
              src={image ? URL.createObjectURL(image) : user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300'}
              alt="Profile"
              className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-cover border-2 border-accent/20 transition-all group-hover:border-accent"
            />
            <input
              type="file"
              id="owner-avatar"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute inset-0 bg-black/50 rounded-xl hidden group-hover:flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </label>
        </div>

        {image && (
          <button
            onClick={updateImage}
            disabled={uploading}
            className="btn-primary px-3 py-1.5 text-xs rounded-lg"
          >
            {uploading ? 'Saving...' : 'Save'}
            <Check className="w-3 h-3" />
          </button>
        )}

        <div className="hidden md:flex flex-col items-center text-center">
          <p className="text-sm font-semibold text-text-primary truncate max-w-[150px]">
            {user?.name || 'Owner'}
          </p>
          <span className="text-[10px] text-accent mt-0.5 uppercase tracking-wider font-semibold">
            Verified Host
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 w-full pt-4 border-t border-border">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.path === '/owner'
            ? location.pathname === '/owner'
            : location.pathname.startsWith(link.path);

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/owner'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-accent'}`} />
              <span className="hidden md:inline">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;