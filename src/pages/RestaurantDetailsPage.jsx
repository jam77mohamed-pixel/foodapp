import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  ShoppingBag,
  Share2
} from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { formatCurrency, formatDeliveryFee } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRestaurantById, isLoading } = useRestaurants();
  const { addToCart } = useCart();

  const restaurant = useMemo(() => {
    return getRestaurantById(id);
  }, [getRestaurantById, id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Restaurant link copied to clipboard!');
    } else {
      toast.info('Share URL: ' + window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 mx-auto border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading restaurant details...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-400">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Restaurant Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          The requested restaurant could not be located in our directory. It might have been updated or removed.
        </p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20">
      {/* Back Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/restaurants')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-slate-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Back to Restaurant Directory</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Share link"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 overflow-hidden shadow-2xl">
        {/* Background Image Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-950">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/50 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
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
                  <span>Open for Orders</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Currently Closed</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Content Below Hero */}
        <div className="p-6 sm:p-8 -mt-16 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {restaurant.description}
              </p>
            </div>

            {/* Rating pill */}
            <div className="flex items-center gap-3 self-start md:self-auto p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-lg">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-base font-black text-white">
                  {restaurant.rating?.toFixed(1) || '4.8'} / 5.0
                </p>
                <p className="text-[11px] text-slate-400">
                  Based on {restaurant.reviewCount || 180} diner reviews
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Delivery</p>
              <p className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{restaurant.deliveryTime}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Fee</p>
              <p className="text-sm sm:text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <Bike className="w-4 h-4" />
                <span>{formatDeliveryFee(restaurant.deliveryFee)}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Restaurant Phone</p>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5 truncate">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{restaurant.phone || '+1 (555) 234-5678'}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Kitchen Address</p>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Dishes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-400" />
            <span>Featured Culinary Menu Items ({restaurant.dishes?.length || 0})</span>
          </h2>
          <span className="text-xs text-slate-400">Chef's Signature Dishes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(restaurant.dishes || []).map((dish) => (
            <div
              key={dish.id}
              className="p-4 rounded-3xl bg-[#18181b]/95 border border-neutral-800 hover:border-orange-500/40 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-neutral-900">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    {dish.isVeg ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                        Vegetarian
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-950/90 text-rose-400 border border-rose-500/40 backdrop-blur-md">
                        Non-Veg
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Prepared fresh to order using finest ingredients and authentic {restaurant.cuisine} spice balance.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Price</span>
                  <p className="text-lg font-black text-white">
                    {formatCurrency(dish.price || 14.50)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    image: dish.image,
                    restaurantName: restaurant.name,
                    category: restaurant.cuisine,
                    isVeg: dish.isVeg
                  }, 1)}
                  className="px-4 py-2 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
