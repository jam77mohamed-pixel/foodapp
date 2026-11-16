import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Receipt,
  LayoutDashboard
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useRestaurants } from '../context/RestaurantContext';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { recentOrders } = useRestaurants();

  // Find order in context or location.state
  const order = location.state?.order || (recentOrders || []).find(o => o.id === orderId);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-3xl mx-auto py-8 sm:py-12 pb-20">
      {/* Success Card */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-emerald-500/30 text-white p-6 sm:p-10 text-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Animated Checkmark Icon */}
        <div className="relative z-10 w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading & Order ID */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Placed & Transmitted to Kitchen</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Thank you! Your order is confirmed.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Order Reference ID: <strong className="font-mono text-orange-400 font-bold">{orderId}</strong>
          </p>
        </div>

        {/* Estimated Arrival Banner */}
        <div className="relative z-10 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-around gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase text-slate-400">Estimated Delivery</p>
              <p className="text-base font-black text-white">{order?.estimatedDelivery || '25 - 35 mins'}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase text-slate-400">Status</p>
              <p className="text-base font-black text-emerald-400">{order?.status || 'Kitchen Preparing'}</p>
            </div>
          </div>
        </div>

        {/* Order Details Snippet */}
        {order && (
          <div className="relative z-10 p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span>{order.restaurantName}</span>
              </div>
              <span className="text-slate-400 font-semibold">{order.paymentMethod}</span>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Items:</p>
              <p className="text-white font-medium">{Array.isArray(order.items) ? order.items.join(', ') : order.items}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Drop-off Address:</p>
              <p className="text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{order.address}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-baseline justify-between text-sm">
              <span className="font-bold text-slate-300">Total Paid</span>
              <span className="text-lg font-black text-orange-400">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={`/tracking/${orderId}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/order-history"
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>View Receipt & Invoice</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
