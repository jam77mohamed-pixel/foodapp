import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { BottomDock } from '../components/common/BottomDock';
import { Sidebar } from '../components/common/Sidebar';
import { RestaurantFormModal } from '../components/restaurants/RestaurantFormModal';
import { useRestaurants } from '../context/RestaurantContext';

export const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAddRestaurantModalOpen, setIsAddRestaurantModalOpen } = useRestaurants();

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 relative overflow-x-hidden flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Soft Modern Dark Neutral Ambient Glows */}
      <div className="fixed top-[-10%] left-[-8%] w-[550px] h-[550px] bg-orange-500/06 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-8%] w-[600px] h-[600px] bg-amber-500/05 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[35%] right-[15%] w-[400px] h-[400px] bg-rose-600/05 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[20%] left-[10%] w-[350px] h-[350px] bg-emerald-500/04 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Floating 3D Geometric Accents */}
      <div className="hidden xl:block fixed top-24 left-8 pointer-events-none z-0 opacity-80 animate-pulse">
        <div className="w-4 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 rotate-45 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
      </div>
      <div className="hidden xl:block fixed bottom-32 left-12 pointer-events-none z-0 opacity-70">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
      </div>
      <div className="hidden xl:block fixed top-32 right-12 pointer-events-none z-0 opacity-60">
        <div className="w-4 h-4 text-orange-400">✦</div>
      </div>
      <div className="hidden xl:block fixed bottom-44 right-16 pointer-events-none z-0 opacity-70">
        <div className="w-5 h-5 text-amber-400">★</div>
      </div>

      {/* Sidebar navigation */}
      <Sidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onOpenAddRestaurantModal={() => setIsAddRestaurantModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen relative z-10 pb-20">
        {/* Top Navbar */}
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Dynamic page outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Floating Dock Navigation for Mobile */}
      <BottomDock />

      {/* Single Global Add Restaurant Modal */}
      <RestaurantFormModal
        isOpen={isAddRestaurantModalOpen}
        onClose={() => setIsAddRestaurantModalOpen(false)}
      />
    </div>
  );
};
