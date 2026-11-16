import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Flame, 
  Utensils, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  Store,
  ChefHat,
  Share2,
  Sparkles
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { MenuItemFormModal } from '../components/menu/MenuItemFormModal';
import { DeleteConfirmModal } from '../components/menu/DeleteConfirmModal';
import { toast } from 'react-toastify';

export const FoodDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getMenuItemById, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleAvailability,
    isLoading 
  } = useMenu();

  const { addToCart } = useCart();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const item = getMenuItemById(id);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto py-8">
        <div className="w-32 h-6 bg-neutral-800 rounded-lg" />
        <div className="w-full h-80 bg-neutral-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="w-3/4 h-8 bg-neutral-800 rounded" />
            <div className="w-full h-24 bg-neutral-800 rounded" />
          </div>
          <div className="w-full h-48 bg-neutral-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-neutral-800 text-orange-400 mx-auto flex items-center justify-center">
          <Utensils className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Food Item Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          The dish you are looking for may have been deleted or does not exist in the menu catalog.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(item, orderQuantity);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.info('Direct link copied to clipboard!');
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Top Navigation Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Back to Menu Catalog</span>
        </Link>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            title="Share dish"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 hover:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Dish</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-rose-950/60 border border-neutral-800 hover:border-rose-500/40 text-rose-400 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Media & Content, Right Purchase / Stock Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Image & Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Image Card */}
          <div className="relative rounded-3xl overflow-hidden bg-[#18181b] border border-neutral-800 shadow-[0_15px_40px_rgba(0,0,0,0.8)] h-72 sm:h-96">
            <img
              src={imageError || !item.image ? fallbackImage : item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-black/25 to-transparent" />

            {/* Badges in image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg ${
                    item.isVeg
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span>{item.isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-900/90 text-orange-300 border border-neutral-700 backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              {/* Stock availability badge */}
              <button
                type="button"
                onClick={() => toggleAvailability(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg cursor-pointer transition-transform active:scale-95 ${
                  item.isAvailable
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                }`}
                title="Click to toggle stock"
              >
                {item.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In Stock (Available)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Currently Unavailable</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Restaurant & Star Rating Banner */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Store className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold">{item.restaurantName}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-amber-400 text-xs font-black">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{item.rating || 4.8}</span>
                <span className="text-[11px] text-slate-300">({item.reviewCount || 42} reviews)</span>
              </div>
            </div>
          </div>

          {/* Title & Description Section */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {item.name}
                </h1>
                <p className="text-xs text-orange-400 font-semibold mt-1">
                  Authentic Recipe from {item.restaurantName}
                </p>
              </div>

              <div className="text-3xl font-black text-orange-400">
                {formatCurrency(item.price)}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-neutral-800">
              {item.description}
            </p>

            {/* Quick Metrics (Prep Time, Calories) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-800">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Prep Time</span>
                </div>
                <div className="text-sm font-black text-white">{item.prepTime || '15 mins'}</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Calories</span>
                </div>
                <div className="text-sm font-black text-white">{item.calories || '420 kcal'}</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Category</span>
                </div>
                <div className="text-sm font-black text-white">{item.category}</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Diet Style</span>
                </div>
                <div className="text-sm font-black text-white">{item.isVeg ? 'Vegetarian' : 'Non-Veg'}</div>
              </div>
            </div>
          </div>

          {/* Ingredients & Recipe Notes */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-400" />
              <span>Ingredients & Culinary Notes</span>
            </h3>

            {/* Ingredients pills */}
            {Array.isArray(item.ingredients) && item.ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-slate-200 font-medium"
                  >
                    🌱 {ing}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Fresh chef selected ingredients.</p>
            )}

            {/* Preparation Instructions / Notes */}
            {item.instructions && (
              <div className="mt-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Preparation & Serving Style:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.instructions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Placement & Quick Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-20 rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 space-y-6 shadow-2xl">
            {/* Price & Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Item Price</span>
                <span className="text-2xl font-black text-orange-400">
                  {formatCurrency(item.price)}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs font-bold text-slate-300">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-black flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white w-6 text-center">
                    {orderQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-black flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex items-baseline justify-between pt-2 border-t border-neutral-800 text-xs">
                <span className="text-slate-400 font-medium">Estimated Subtotal</span>
                <span className="text-base font-black text-white">
                  {formatCurrency(item.price * orderQuantity)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                item.isAvailable
                  ? 'btn-gradient-glow text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer active:scale-98'
                  : 'bg-neutral-800 text-slate-400 cursor-not-allowed border border-neutral-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{item.isAvailable ? 'Add Dish to Order' : 'Dish Out of Stock'}</span>
            </button>

            {/* Stock Toggle Quick Action */}
            <div className="pt-2 border-t border-neutral-800 space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Kitchen Inventory Control
              </div>
              <button
                type="button"
                onClick={() => toggleAvailability(item.id)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  item.isAvailable
                    ? 'bg-neutral-900 border-neutral-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                }`}
              >
                {item.isAvailable ? (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Mark as Out of Stock</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mark as In Stock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <MenuItemFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => updateMenuItem(item.id, data)}
        initialData={item}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={item}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(targetId) => {
          deleteMenuItem(targetId);
          navigate('/menu');
        }}
      />
    </div>
  );
};
