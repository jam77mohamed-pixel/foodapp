import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Flame, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Star,
  Plus
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const MenuItemCard = ({
  item,
  onEdit,
  onDelete,
  onToggleAvailability
}) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
  };

  return (
    <div className="group relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(249,115,22,0.15)] flex flex-col justify-between overflow-hidden">
      {/* Top Media & Badges */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
          <img
            src={imageError || !item.image ? fallbackImage : item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-black/20 to-transparent" />

          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            {/* Veg / Non-Veg Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black backdrop-blur-md border shadow-md bg-black/60 pointer-events-auto">
              <span
                className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                  item.isVeg
                    ? 'border-emerald-500 bg-emerald-950/70'
                    : 'border-rose-500 bg-rose-950/70'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
              </span>
              <span className={item.isVeg ? 'text-emerald-300' : 'text-rose-300'}>
                {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </span>
            </div>

            {/* Availability Status Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onToggleAvailability) onToggleAvailability(item.id);
              }}
              title="Click to toggle availability"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black backdrop-blur-md border shadow-md transition-transform active:scale-95 pointer-events-auto cursor-pointer ${
                item.isAvailable
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900'
              }`}
            >
              {item.isAvailable ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>Out of Stock</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Photo Overlay: Category & Price Badge */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-neutral-900/90 text-orange-300 border border-neutral-700/80 backdrop-blur-sm">
              {item.category}
            </span>

            <span className="text-base font-black text-white px-2.5 py-0.5 rounded-xl bg-orange-500/90 shadow-md">
              {formatCurrency(item.price)}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Restaurant & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
            <span className="truncate font-semibold text-slate-300" title={item.restaurantName}>
              📍 {item.restaurantName || 'Gourmet Kitchen'}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{item.rating || 4.8}</span>
              <span className="text-[10px] text-slate-400">({item.reviewCount || 42})</span>
            </div>
          </div>

          {/* Dish Name */}
          <Link
            to={`/menu/${item.id}`}
            className="block text-base font-black text-white hover:text-orange-400 transition-colors line-clamp-1"
            title={item.name}
          >
            {item.name}
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Prep time & Calories metrics */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300">
            {item.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-400" />
                <span>{item.prepTime}</span>
              </div>
            )}
            {item.calories && (
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{item.calories}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 pt-0 border-t border-neutral-800/80 mt-2">
        <div className="flex items-center justify-between gap-2 pt-3">
          {/* View Details Link */}
          <Link
            to={`/menu/${item.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-200 hover:text-white text-xs font-bold transition-all text-center"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Details</span>
          </Link>

          {/* Add to Cart Quick Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              item.isAvailable
                ? 'btn-gradient-glow text-white shadow-xs cursor-pointer'
                : 'bg-neutral-800/60 text-slate-400 border border-neutral-800 cursor-not-allowed'
            }`}
            title={item.isAvailable ? 'Add to Cart' : 'Item is unavailable'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Quick Edit */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onEdit) onEdit(item);
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
            title="Edit dish details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Quick Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDelete) onDelete(item);
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-950/60 border border-neutral-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete this dish"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
