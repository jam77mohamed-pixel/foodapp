import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Clock, Pizza } from 'lucide-react';

export const QuickActions = ({ onOpenAddRestaurant }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Action 1: Add Restaurant */}
      <button
        type="button"
        onClick={onOpenAddRestaurant}
        className="p-5 rounded-3xl bg-gradient-to-br from-neutral-900 to-[#1e1b18] border border-orange-500/30 hover:border-orange-500/70 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(249,115,22,0.15)] text-left group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-xs">
          <PlusCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-black text-white group-hover:text-orange-300 transition-colors">
          + Add Restaurant
        </h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Onboard a new dining partner and setup profile
        </p>
      </button>

      {/* Action 2: Explore Restaurants */}
      <Link
        to="/restaurants"
        className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 shadow-lg text-left group transition-all duration-300 hover:-translate-y-1 block"
      >
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
          <Search className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
          Browse Restaurants
        </h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Filter by cuisine, rating, delivery time, and fees
        </p>
      </Link>

      {/* Action 3: Menu Catalog Management */}
      <Link
        to="/menu"
        className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/50 shadow-lg text-left group transition-all duration-300 hover:-translate-y-1 block"
      >
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
          <Pizza className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
          Manage Menu Items
        </h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Add dishes, update prices, and control stock status
        </p>
      </Link>

      {/* Action 4: Live Orders */}
      <Link
        to="/orders"
        className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-cyan-500/50 shadow-lg text-left group transition-all duration-300 hover:-translate-y-1 block"
      >
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
          <Clock className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
          Track Kitchen Orders
        </h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Monitor live cooking, drivers en route & delivered
        </p>
      </Link>
    </div>
  );
};
