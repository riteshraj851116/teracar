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
    <div className="min-h-screen flex flex-col overflow-hidden bg-[#0B0B0B] text-[#F4F2ED]">
      <NavbarOwner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full overflow-y-auto scrollbar-none p-6 md:p-10 pb-16 bg-[#0B0B0B]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;