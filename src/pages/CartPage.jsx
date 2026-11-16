import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  Tag,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    isEligibleForFreeDelivery,
    amountNeededForFreeDelivery,
    freeDeliveryProgress,
    tax,
    discountAmount,
    totalPrice,
    totalItemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    if (ok) setCouponInput('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 text-white p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Food Tray & Order Summary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your Food Cart 🛒
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Review your items, apply promotional discount coupons, and proceed to checkout.
            </p>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-slate-400 hover:text-rose-400 hover:border-rose-900/60 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Free Delivery Goal Bar */}
      {cartItems.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b]/95 border border-neutral-800 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-white">
              <Truck className="w-4 h-4 text-orange-400 shrink-0" />
              {isEligibleForFreeDelivery ? (
                <span className="text-emerald-400">
                  🎉 Congratulations! Your order qualifies for 100% FREE delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-orange-400">{formatCurrency(amountNeededForFreeDelivery)}</strong> more for FREE delivery
                </span>
              )}
            </div>
            <span className="font-black text-orange-400 text-xs sm:text-sm">
              {freeDeliveryProgress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-500 ease-out"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Grid: Items List vs Summary */}
      {cartItems.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#18181b]/60 border border-neutral-800 p-8 space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 text-orange-400 mx-auto flex items-center justify-center shadow-inner">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">Your Cart is Currently Empty</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Looks like you haven't added any dishes yet. Explore our top restaurants and artisan menus to get started!
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Menu Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left: Cart Items List (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Ordered Items ({totalItemCount})
              </h2>
              <Link
                to="/menu"
                className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
              >
                + Add More Dishes
              </Link>
            </div>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-all shadow-xl"
                >
                  {/* Left: Food Image & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover shrink-0 border border-neutral-800"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                          }`}
                          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        />
                        <h3 className="text-sm sm:text-base font-black text-white truncate">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-xs text-orange-400 font-semibold truncate">
                        {item.restaurantName || 'Gourmet Kitchen'}
                      </p>

                      <p className="text-xs text-slate-400">
                        {formatCurrency(item.price)} each &bull; {item.category}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity Controls & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-right min-w-[70px]">
                      <p className="text-base font-black text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cart Summary Card (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 space-y-5 shadow-2xl">
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-400" />
                <span>Cart Summary</span>
              </h3>

              {/* Promo Coupon Module */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-black text-white">Promotions & Coupons</span>
                </div>

                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-black text-white">{appliedCoupon.code}</span>
                      </div>
                      <p className="text-[11px] text-emerald-300 font-medium">
                        {appliedCoupon.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. WELCOME50"
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs uppercase font-bold text-white placeholder-slate-400 outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl btn-gradient-glow text-white text-xs font-bold cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {availableCoupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => applyCoupon(c.code)}
                          className="px-2 py-0.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-[10px] font-bold text-orange-400 hover:text-orange-300 border border-neutral-700/60 transition-colors cursor-pointer"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </form>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-3 text-xs sm:text-sm border-t border-neutral-800 pt-4">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Items Subtotal ({totalItemCount} items)</span>
                  <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Estimated Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-400">FREE</span>
                  ) : (
                    <span className="font-bold text-white">{formatCurrency(deliveryFee)}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Estimated Taxes (8%)</span>
                  <span className="font-bold text-white">{formatCurrency(tax)}</span>
                </div>

                {/* Coupon discount line */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="font-medium flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Promotional Discount ({appliedCoupon?.code})</span>
                    </span>
                    <span className="font-black">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-3 border-t border-neutral-800 text-white">
                  <div>
                    <span className="text-base font-black">Grand Total</span>
                    <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
                  </div>
                  <span className="text-2xl font-black text-orange-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secure Checkout Promise */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted checkout with live tracking support</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
