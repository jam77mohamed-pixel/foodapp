import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { BrandLogo } from '../components/common/BrandLogo';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-orange-500/06 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-amber-500/05 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating 3D Geometric Accents */}
      <div className="hidden lg:block fixed top-20 left-16 pointer-events-none z-0 opacity-80 animate-pulse">
        <div className="w-5 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 rotate-45 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
      </div>
      <div className="hidden lg:block fixed bottom-24 left-20 pointer-events-none z-0 opacity-80">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-600 shadow-[0_0_25px_rgba(239,68,68,0.4)]" />
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md sm:max-w-lg bg-[#18181b]/95 backdrop-blur-2xl rounded-[2.5rem] border border-neutral-800 p-6 sm:p-9 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(249,115,22,0.15)] relative z-10 transition-all">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-block">
            <BrandLogo showSubtitle={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
            Create Portal Account
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Join the Food Delivery Management System to explore restaurants and manage orders
          </p>
        </div>

        <RegisterForm />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 font-medium relative z-10">
        &copy; 2025 CRAVEFLOW &bull; Food Delivery Management System
      </div>
    </div>
  );
};
