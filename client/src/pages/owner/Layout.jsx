import React, { useEffect } from 'react';
import NavbarOwner from '../../components/owner/NavbarOwner';
import Sidebar from '../../components/owner/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate('/');
    }
  }, [isOwner, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#090d16] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <NavbarOwner />
      
      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content View */}
        <main className="flex-1 w-full overflow-y-auto scrollbar-none p-6 md:p-10 pb-16 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;