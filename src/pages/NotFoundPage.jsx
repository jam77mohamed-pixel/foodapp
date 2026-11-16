import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 text-center relative overflow-hidden text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/06 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/05 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#18181b]/95 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(249,115,22,0.15)] space-y-4 relative z-10">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-400 shadow-md">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 tracking-wider">
          404
        </h1>
        <h2 className="text-xl font-black text-white uppercase tracking-wider">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-400">
          The page or restaurant menu you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 btn-gradient-glow text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
