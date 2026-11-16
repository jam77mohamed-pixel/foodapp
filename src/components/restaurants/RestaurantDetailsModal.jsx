import React from 'react';
import { 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  UtensilsCrossed, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDeliveryFee } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const RestaurantDetailsModal = ({ restaurant, isOpen, onClose }) => {
  if (!restaurant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={restaurant.name}
      subtitle={`${restaurant.cuisine} Cuisine &bull; ${restaurant.address}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Hero Image Section */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-orange-400 border border-orange-500/40">
              {restaurant.cuisine}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 ${
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
                  <span>Currently Closed</span>
                </>
              )}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-black">{restaurant.rating?.toFixed(1) || '4.8'}</span>
              <span className="text-xs text-slate-400">({restaurant.reviewCount || 180} customer reviews)</span>
            </div>

            <Link
              to={`/restaurants/${restaurant.id}`}
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/80 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-lg"
            >
              <span>Full Page View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Overview & Key Highlights */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Delivery</p>
              <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{restaurant.deliveryTime}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Fee</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" />
                <span>{formatDeliveryFee(restaurant.deliveryFee)}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Price Range</p>
              <p className="text-sm font-bold text-orange-400 mt-0.5">
                {restaurant.priceRange || '$$'} Moderate
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Direct Phone</p>
              <p className="text-xs font-bold text-slate-300 mt-1 truncate">
                {restaurant.phone || '+1 (555) 234-5678'}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Tags */}
        {restaurant.features && restaurant.features.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {restaurant.features.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-neutral-900 border border-neutral-800 text-slate-300"
              >
                <CheckCircle2 className="w-3 h-3 text-orange-400" />
                <span>{feature}</span>
              </span>
            ))}
          </div>
        )}

        {/* Signature Menu Items from Third-Party API */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              <span>Signature Dishes & Menu Items</span>
            </h4>
            <span className="text-xs text-slate-400">
              {restaurant.dishes?.length || 0} Special Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(restaurant.dishes || []).map((dish) => (
              <div
                key={dish.id}
                className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-orange-500/30 flex items-center gap-3 transition-colors group"
              >
                {/* Dish Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    loading="lazy"
                  />
                </div>

                {/* Dish Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                      {dish.name}
                    </p>
                    {dish.isVeg ? (
                      <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                        Veg
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 shrink-0">
                        Non-Veg
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-black text-orange-400 mt-1">
                    {formatCurrency(dish.price || 14.50)}
                  </p>

                  {dish.calories && (
                    <span className="text-[10px] text-slate-400">
                      {dish.calories} kcal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Opening Hours */}
        <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{restaurant.address}</span>
          </div>
          <div className="text-slate-300 font-medium">
            Operating Hours: <span className="text-white font-bold">10:00 AM - 11:30 PM Daily</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
