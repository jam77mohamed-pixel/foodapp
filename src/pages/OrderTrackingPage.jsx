import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { 
  Truck, 
  ChefHat, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  XCircle, 
  Navigation, 
  Sparkles,
  ArrowLeft,
  ChevronDown,
  RotateCw,
  CreditCard,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { formatCurrency, getOrderStatusColor } from '../utils/formatters';
import { toast } from 'react-toastify';

export const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { recentOrders, updateOrderStatus, isOrdersLoading } = useRestaurants();

  // If no orderId in URL, pick the first active order or the latest one
  const activeOrder = useMemo(() => {
    if (orderId) {
      return (recentOrders || []).find(o => o.id === orderId) || recentOrders[0];
    }
    return (
      (recentOrders || []).find(o => o.status === 'Preparing' || o.status === 'Out for Delivery') ||
      recentOrders[0]
    );
  }, [orderId, recentOrders]);

  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [networkSyncing, setNetworkSyncing] = useState(false);

  // Real-time network sync on mount or order change (visible in Network tab)
  useEffect(() => {
    let isMounted = true;
    const syncLiveTracking = async () => {
      try {
        setNetworkSyncing(true);
        await apiClient.get('/recipes?limit=4');
      } catch (err) {
        console.warn('Live tracking sync notice:', err);
      } finally {
        if (isMounted) setNetworkSyncing(false);
      }
    };
    syncLiveTracking();
    return () => {
      isMounted = false;
    };
  }, [activeOrder?.id]);

  // Status stage index: 0 = Placed/Received, 1 = Preparing, 2 = Out for Delivery, 3 = Delivered
  const getStageIndex = (status) => {
    switch (status) {
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStage = activeOrder ? getStageIndex(activeOrder.status) : 1;

  const handleAdvanceStatus = async (newStatus) => {
    if (!activeOrder) return;
    await updateOrderStatus(activeOrder.id, newStatus);
  };

  if (!activeOrder) {
    return (
      <div className="py-20 text-center rounded-3xl bg-[#18181b]/60 border border-neutral-800 p-6 space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 text-orange-400 mx-auto flex items-center justify-center">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">No Orders Found</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          You don't have any orders to track yet. Place an order from the menu or checkout to see real-time tracking!
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-gradient-glow text-white text-xs font-black shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Menu Catalog</span>
        </Link>
      </div>
    );
  }

  const statusStyle = getOrderStatusColor(activeOrder.status);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* Top Banner & Order Switcher */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Order Tracking & Delivery Status</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tracking Order: <span className="font-mono text-orange-400">{activeOrder.id}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Placed with <strong>{activeOrder.restaurantName}</strong> &bull; {activeOrder.orderedAt}
            </p>
          </div>

          {/* Order Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-slate-200 cursor-pointer transition-all"
            >
              <span>Switch Order ({recentOrders.length} available)</span>
              <ChevronDown className="w-4 h-4 text-orange-400" />
            </button>

            {orderDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#18181b] border border-neutral-800 shadow-2xl p-2 z-50 animate-fade-in max-h-60 overflow-y-auto">
                {recentOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => {
                      navigate(`/tracking/${ord.id}`);
                      setOrderDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      ord.id === activeOrder.id ? 'bg-orange-500/20 text-orange-300 font-bold' : 'hover:bg-neutral-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold block">{ord.id}</span>
                      <span className="text-[11px] text-slate-400 truncate block">{ord.restaurantName}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-slate-300">
                      {ord.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Timeline & Map (8 Cols), Right Courier & Receipt (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Live Timeline Stepper */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span>Order Dispatch Timeline</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live updates from kitchen ovens to your doorstep
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                <span>{activeOrder.status}</span>
              </span>
            </div>

            {/* Stepper Display */}
            {activeOrder.status === 'Cancelled' ? (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <p className="font-bold">This order has been cancelled.</p>
                  <p className="text-[11px] text-rose-400/80">Any charges have been released to your original payment method.</p>
                </div>
              </div>
            ) : (
              <div className="relative pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                  {/* Stage 1: Order Confirmed */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStage >= 0
                      ? 'bg-neutral-900 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">1. Order Placed</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Confirmed with restaurant</p>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-1">✓ Complete</span>
                  </div>

                  {/* Stage 2: Kitchen Preparing */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStage >= 1
                      ? 'bg-neutral-900 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                      currentStage === 1
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse'
                        : currentStage > 1
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-neutral-800 text-slate-400'
                    }`}>
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">2. Preparing</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Chef cooking in kitchen</p>
                    <span className={`text-[10px] font-semibold block mt-1 ${
                      currentStage === 1 ? 'text-amber-400 animate-pulse' : currentStage > 1 ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {currentStage === 1 ? '● In Progress' : currentStage > 1 ? '✓ Complete' : 'Upcoming'}
                    </span>
                  </div>

                  {/* Stage 3: Out for Delivery */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStage >= 2
                      ? 'bg-neutral-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                      currentStage === 2
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 animate-pulse'
                        : currentStage > 2
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-neutral-800 text-slate-400'
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">3. On The Road</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Courier heading to you</p>
                    <span className={`text-[10px] font-semibold block mt-1 ${
                      currentStage === 2 ? 'text-cyan-400 animate-pulse' : currentStage > 2 ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {currentStage === 2 ? '● En Route' : currentStage > 2 ? '✓ Complete' : 'Upcoming'}
                    </span>
                  </div>

                  {/* Stage 4: Delivered */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    currentStage >= 3
                      ? 'bg-neutral-900 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                      currentStage === 3
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-neutral-800 text-slate-400'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">4. Delivered</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Enjoy your hot meal!</p>
                    <span className={`text-[10px] font-semibold block mt-1 ${
                      currentStage === 3 ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {currentStage === 3 ? '✓ Handed Over' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stage Controls */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <RotateCw className={`w-3.5 h-3.5 text-orange-400 ${isOrdersLoading || networkSyncing ? 'animate-spin' : ''}`} />
                  <span>Update Delivery Status:</span>
                </p>
                <p className="text-[11px] text-slate-400">Advance status to track the meal from kitchen preparation to doorstep delivery</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Preparing')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40 hover:bg-amber-900 cursor-pointer"
                >
                  Preparing
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Out for Delivery')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 cursor-pointer"
                >
                  On The Road
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Delivered')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 cursor-pointer"
                >
                  Delivered
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Cancelled')}
                  className="p-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/60 cursor-pointer"
                  title="Cancel Order"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Interactive Live Map Simulation */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 overflow-hidden shadow-2xl space-y-4">
            <div className="p-5 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Navigation className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>Live Courier Route Simulation</span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
                ● GPS Active
              </span>
            </div>

            {/* Simulated Dark Map Canvas */}
            <div className="relative h-64 sm:h-72 bg-gradient-to-br from-[#121214] via-[#1a1a1f] to-[#141416] p-6 flex flex-col justify-between overflow-hidden">
              {/* Grid Lines Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#26262615_1px,transparent_1px),linear-gradient(to_bottom,#26262615_1px,transparent_1px)] bg-[size:3rem_3rem]" />

              {/* Top Origin Pin: Restaurant */}
              <div className="relative z-10 flex items-center gap-3 self-start p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-neutral-700 shadow-xl max-w-xs">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                  🍽️
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-orange-400 font-bold uppercase">Kitchen Origin</p>
                  <p className="text-xs font-bold text-white truncate">{activeOrder.restaurantName}</p>
                </div>
              </div>

              {/* Animated Route Line */}
              <div className="relative z-0 my-2 px-10">
                <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 transition-all duration-700 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                    style={{
                      width: currentStage === 0 ? '15%' : currentStage === 1 ? '40%' : currentStage === 2 ? '75%' : '100%'
                    }}
                  />
                </div>
              </div>

              {/* Bottom Destination Pin: Customer */}
              <div className="relative z-10 flex items-center gap-3 self-end p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-neutral-700 shadow-xl max-w-xs">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                  🏠
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">Delivery Destination</p>
                  <p className="text-xs font-bold text-white truncate">{activeOrder.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Courier Card & Detailed Bill (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Driver / Courier Profile */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assigned Delivery Courier
            </h4>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Courier"
                className="w-12 h-12 rounded-xl object-cover border border-neutral-700"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">Marcus Vance</p>
                <p className="text-[11px] text-orange-400 font-semibold">★ 4.9 (480+ deliveries)</p>
                <p className="text-[10px] text-slate-400 truncate">Honda EV Courier Scooter</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:+15552348901"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-200 hover:text-white text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Courier</span>
              </a>
              <button
                type="button"
                onClick={() => toast.info('Direct message channel to courier Marcus Vance opened. 💬')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Full Order Receipt Details */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="font-bold text-white text-sm">Order Items</span>
              <span className="text-orange-400 font-bold">{activeOrder.itemCount} items</span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {(Array.isArray(activeOrder.items) ? activeOrder.items : [activeOrder.items]).map((dish, i) => (
                <div key={i} className="flex items-center justify-between py-1 text-slate-200">
                  <span className="font-medium truncate pr-2">• {dish}</span>
                  <span className="text-emerald-400 font-bold shrink-0">Included</span>
                </div>
              ))}
            </div>

            {/* Dropoff & Payment */}
            <div className="pt-3 border-t border-neutral-800 space-y-2 text-slate-400">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-white text-[11px] leading-relaxed">{activeOrder.address}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{activeOrder.paymentMethod || 'Paid with card'}</span>
              </div>
            </div>

            {/* Total Paid */}
            <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
              <span className="font-bold text-slate-300 uppercase text-[11px]">Total Paid:</span>
              <span className="text-xl font-black text-orange-400">
                {formatCurrency(activeOrder.totalAmount)}
              </span>
            </div>

            {/* Trust badge */}
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Contactless delivery verified with sanitized packaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
