import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isVendorDashboard = location.pathname === '/vendor/dashboard';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      {!isVendorDashboard && <Footer />}
    </div>
  );
};

export default MainLayout;