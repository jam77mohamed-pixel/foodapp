import React from 'react';
import { Star, Clock, Bike, MapPin, ChevronRight, Eye } from 'lucide-react';
import { formatDeliveryFee } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const RestaurantCard = ({ restaurant, onViewDetails }) => {
  return (
    <div className="group rounded-3xl bg-[#18181b]/95 border border-neutral-800 hover:border-orange-500/50 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
      {/* Top Image & Floating Badges */}
      <div 
        className="relative w-full h-48 overflow-hidden bg-neutral-900 cursor-pointer"
        onClick={() => onViewDetails(restaurant)}
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          {/* Cuisine Pill */}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-orange-400 border border-orange-500/40 shadow-md">
            {restaurant.cuisine}
          </span>

          {/* Open / Closed Status Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-md ${
              restaurant.isOpen
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50'
                : 'bg-rose-950/80 text-rose-400 border border-rose-500/50'
            }`}
          >
            {restaurant.isOpen ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open Now</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Closed</span>
              </>
            )}
          </span>
        </div>

        {/* Rating Star Badge bottom right of image */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700/80 text-white flex items-center gap-1.5 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black">{restaurant.rating?.toFixed(1) || '4.8'}</span>
          <span className="text-[10px] text-slate-400">({restaurant.reviewCount || 180})</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => onViewDetails(restaurant)}
            className="text-base sm:text-lg font-black text-white group-hover:text-orange-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {restaurant.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="truncate">{restaurant.address}</span>
        </div>

        {/* Delivery Time & Delivery Fee Badges */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
          {/* Delivery Time */}
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center gap-1.5 font-bold">
            <Bike className="w-3.5 h-3.5 text-emerald-400" />
            <span
              className={
                restaurant.deliveryFee === 0
                  ? 'text-emerald-400 font-black'
                  : 'text-slate-300'
              }
            >
              {formatDeliveryFee(restaurant.deliveryFee)}
            </span>
          </div>
        </div>

        {/* Two Clear Buttons: Quick Preview Modal & Full Page View */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Button 1: Quick Popup Modal */}
          <button
            type="button"
            onClick={() => onViewDetails(restaurant)}
            className="py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Quick View</span>
          </button>

          {/* Button 2: Dedicated Details Page */}
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="py-2.5 px-3 rounded-xl bg-orange-500/15 border border-orange-500/40 hover:bg-orange-500/25 text-xs font-bold text-orange-400 hover:text-orange-300 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
