import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { BrandLogo } from '../components/common/BrandLogo';
import { UtensilsCrossed, Clock, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Soft Modern Dark Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-orange-500/06 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-amber-500/05 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-[45%] right-[15%] w-[350px] h-[350px] bg-rose-600/05 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating 3D Geometric Accents */}
      <div className="hidden lg:block fixed top-20 left-16 pointer-events-none z-0 opacity-80 animate-pulse">
        <div className="w-5 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 rotate-45 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
      </div>
      <div className="hidden lg:block fixed bottom-24 left-20 pointer-events-none z-0 opacity-80">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-600 shadow-[0_0_25px_rgba(239,68,68,0.4)]" />
      </div>
      <div className="hidden lg:block fixed top-28 right-24 pointer-events-none z-0 text-orange-400 text-lg opacity-70">
        ✦
      </div>
      <div className="hidden lg:block fixed bottom-32 right-28 pointer-events-none z-0 text-amber-400 text-2xl opacity-80">
        ★
      </div>

      {/* Central Modern Dark Card Container */}
      <div className="w-full max-w-md sm:max-w-lg bg-[#18181b]/95 backdrop-blur-2xl rounded-[2.5rem] border border-neutral-800 p-6 sm:p-9 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(249,115,22,0.15)] relative z-10 transition-all">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-block">
            <BrandLogo showSubtitle={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
            Welcome to CRAVEFLOW
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Food Delivery Management System with live restaurant listings, orders & real-time analytics
          </p>

          {/* Feature Badges */}
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-orange-400">
              <UtensilsCrossed className="w-3 h-3" />
              <span>Partner Kitchens</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Ordering</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-amber-400">
              <Clock className="w-3 h-3" />
              <span>Live Delivery</span>
            </span>
          </div>
        </div>

        {/* The Login Form */}
        <LoginForm />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 font-medium relative z-10">
        &copy; 2025 CRAVEFLOW &bull; Food Delivery Management System
      </div>
    </div>
  );
};
