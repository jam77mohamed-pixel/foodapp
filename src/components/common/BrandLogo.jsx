import React from 'react';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrandLogo = ({ showSubtitle = true }) => {
  return (
    <Link to="/dashboard" className="flex items-center gap-3 group focus:outline-none">
      {/* Glowing Culinary Flame Icon */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 p-0.5 shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_28px_rgba(249,115,22,0.7)] transition-all duration-300">
          <div className="w-full h-full bg-[#18181b] rounded-[14px] flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#121212] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>

      {/* Brand Name */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-200 bg-clip-text text-transparent">
            CRAVE<span className="text-orange-500">FLOW</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/30">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium text-slate-400 tracking-wide">
            Food Delivery Portal
          </span>
        )}
      </div>
    </Link>
  );
};
