import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  Search, 
  Eye, 
  ArrowLeft,
  Truck,
  RotateCw,
  PlusCircle,
  XCircle,
  User,
  Phone,
  CreditCard,
  ChefHat,
  Radio,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { formatCurrency, getOrderStatusColor } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import { Link } from 'react-router-dom';

export const OrdersPage = () => {
  const { 
    recentOrders, 
    isOrdersLoading, 
    lastSyncedTime, 
    refreshOrders, 
    createLiveOrder, 
    updateOrderStatus 
  } = useRestaurants();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Computed stats from real orders
  const stats = useMemo(() => {
    const total = recentOrders.length;
    const preparing = recentOrders.filter(o => o.status === 'Preparing').length;
    const onTheRoad = recentOrders.filter(o => o.status === 'Out for Delivery').length;
    const delivered = recentOrders.filter(o => o.status === 'Delivered').length;
    return { total, preparing, onTheRoad, delivered };
  }, [recentOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return (recentOrders || []).filter((order) => {
      // Status filter
      if (statusFilter !== 'All' && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = order.id?.toLowerCase().includes(query);
        const matchCustomer = order.customerName?.toLowerCase().includes(query);
        const matchPhone = order.customerPhone?.toLowerCase().includes(query);
        const matchRest = order.restaurantName?.toLowerCase().includes(query);
        const matchAddress = order.address?.toLowerCase().includes(query);
        const matchItems = Array.isArray(order.items) &&
          order.items.some((item) => item.toLowerCase().includes(query));

        return matchId || matchCustomer || matchPhone || matchRest || matchAddress || matchItems;
      }
      return true;
    });
  }, [recentOrders, statusFilter, searchQuery]);

  // Handle creating a new live order via API
  const handleCreateTestOrder = async () => {
    const sampleFoods = [
      'Gourmet Margherita Pizza',
      'Artisan Angus Burger',
      'Tonkotsu Ramen Bowl',
      'Truffle Pasta Fettuccine',
      'Street Birria Tacos',
      'Butter Chicken & Naan'
    ];
    const sampleRests = [
      'Bella Napoli Trattoria',
      'The Rustic Burger Bar',
      'Tokyo Sushi Zen',
      'Royal Taj Curry Palace'
    ];
    const pickedDish = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];
    const pickedRest = sampleRests[Math.floor(Math.random() * sampleRests.length)];

    await createLiveOrder({
      customerName: 'Alex Morgan (Customer)',
      customerPhone: '+1 (555) 789-0123',
      restaurantName: pickedRest,
      items: [pickedDish, 'Garlic Herb Bread'],
      totalAmount: (16.99 + Math.random() * 15).toFixed(2),
      address: '742 Evergreen Terrace, West End'
    });
  };

  // Status progression action
  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20">
      {/* Top Banner with Real Network API Badge & Sync Actions */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/08 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Live Kitchen Operations</span>
              </span>

              {/* Real Network Status Indicator */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-xs">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Live Dispatch Active</span>
              </span>

              <span className="text-[11px] text-slate-400 font-medium">
                Last Synced: {lastSyncedTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Order Management & Tracking 🛵
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track live food prep, driver deliveries, and customer orders in real time. Monitor active kitchen orders and update delivery stages as food is handed over.
            </p>
          </div>

          {/* Action Buttons: Network Sync & Place Test Order */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sync Button */}
            <button
              type="button"
              onClick={refreshOrders}
              disabled={isOrdersLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Refresh order feed"
            >
              <RotateCw className={`w-4 h-4 text-orange-400 ${isOrdersLoading ? 'animate-spin' : ''}`} />
              <span>{isOrdersLoading ? 'Refreshing...' : 'Refresh Orders'}</span>
            </button>

            {/* Place Test Order Button */}
            <button
              type="button"
              onClick={handleCreateTestOrder}
              disabled={isOrdersLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-gradient-glow text-white text-xs font-black shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer disabled:opacity-50"
              title="Add a sample order to the kitchen feed"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Live Order</span>
            </button>

            <Link
              to="/dashboard"
              className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Interactive KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Orders */}
        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border transition-all cursor-pointer ${
            statusFilter === 'All' ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-neutral-900 text-slate-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">{stats.total}</p>
          <p className="text-[11px] text-slate-400 mt-1">Live active in system</p>
        </div>

        {/* 2. Kitchen Preparing */}
        <div 
          onClick={() => setStatusFilter('Preparing')}
          className={`p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border transition-all cursor-pointer ${
            statusFilter === 'Preparing' ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-neutral-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Kitchen</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ChefHat className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{stats.preparing}</p>
          <p className="text-[11px] text-slate-400 mt-1">Cooking fresh to order</p>
        </div>

        {/* 3. Out for Delivery */}
        <div 
          onClick={() => setStatusFilter('Out for Delivery')}
          className={`p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border transition-all cursor-pointer ${
            statusFilter === 'Out for Delivery' ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-neutral-800 hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">On The Road</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-cyan-400 mt-2">{stats.onTheRoad}</p>
          <p className="text-[11px] text-slate-400 mt-1">Couriers en route</p>
        </div>

        {/* 4. Delivered */}
        <div 
          onClick={() => setStatusFilter('Delivered')}
          className={`p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border transition-all cursor-pointer ${
            statusFilter === 'Delivered' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-neutral-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{stats.delivered}</p>
          <p className="text-[11px] text-slate-400 mt-1">Fulfilled successfully</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b]/95 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. ORD-8921), customer, phone, restaurant, address, or dish..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-neutral-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards' ? 'bg-neutral-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
              Status:
            </span>
            {['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'btn-gradient-glow text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                      : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredOrders.length}</strong> of {recentOrders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Content Area: Table View OR Cards View */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#18181b]/60 border border-neutral-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-orange-400 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No live orders match your filter "{statusFilter}". Try selecting "All" or place a new test order.
          </p>
          <button
            type="button"
            onClick={() => { setStatusFilter('All'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-orange-400 text-xs font-bold cursor-pointer"
          >
            Clear Active Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* DESKTOP TABLE VIEW */
        <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-neutral-900/50">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Restaurant</th>
                  <th className="py-3.5 px-4">Items Ordered</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status & ETA</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredOrders.map((order) => {
                  const statusStyle = getOrderStatusColor(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-neutral-900/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Order ID */}
                      <td className="py-4 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-white">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                      </td>

                      {/* Restaurant */}
                      <td className="py-4 px-4 font-semibold text-slate-200 whitespace-nowrap">
                        {order.restaurantName}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 max-w-[240px]">
                        <p className="truncate text-slate-300 font-medium">
                          {order.items.join(', ')}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {order.itemCount} item{order.itemCount === 1 ? '' : 's'} &bull; {order.orderedAt}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 font-black text-white whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          <span>{order.status}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          ETA: {order.estimatedDelivery}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white hover:border-orange-500/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-orange-400" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* RESPONSIVE CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const statusStyle = getOrderStatusColor(order.status);
            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-5 rounded-3xl bg-[#18181b]/95 border border-neutral-800 hover:border-orange-500/40 shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar with ID and Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-orange-400">
                      {order.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      <span>{order.status}</span>
                    </span>
                  </div>

                  {/* Customer and Kitchen */}
                  <div>
                    <h4 className="text-base font-bold text-white">{order.customerName}</h4>
                    <p className="text-xs text-orange-400 font-semibold mt-0.5">
                      📍 {order.restaurantName}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold">Items:</div>
                    <div className="text-white font-medium line-clamp-2">
                      {order.items.join(', ')}
                    </div>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-slate-400 truncate">
                    🏠 {order.address}
                  </p>
                </div>

                {/* Bottom Total & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                    <p className="text-lg font-black text-white">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-200 text-xs font-bold"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    <span>View Timeline</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Order Details & Live Timeline Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.id}`}
          subtitle={`Placed with ${selectedOrder.restaurantName} • ${selectedOrder.orderedAt}`}
        >
          <div className="space-y-5">
            {/* Live Progress Stage Stepper */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Live Dispatch Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    getOrderStatusColor(selectedOrder.status).bg
                  } ${getOrderStatusColor(selectedOrder.status).text} ${
                    getOrderStatusColor(selectedOrder.status).border
                  }`}
                >
                  <span>{selectedOrder.status}</span>
                </span>
              </div>

              {/* Step Timeline Indicator */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {['Received', 'Preparing', 'On Route', 'Delivered'].map((step, idx) => {
                  const isCurrent =
                    (idx === 0 && selectedOrder.status !== 'Cancelled') ||
                    (idx === 1 && (selectedOrder.status === 'Preparing' || selectedOrder.status === 'Out for Delivery' || selectedOrder.status === 'Delivered')) ||
                    (idx === 2 && (selectedOrder.status === 'Out for Delivery' || selectedOrder.status === 'Delivered')) ||
                    (idx === 3 && selectedOrder.status === 'Delivered');

                  return (
                    <div key={step} className="text-center space-y-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                            : 'bg-neutral-800'
                        }`}
                      />
                      <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kitchen Advance Actions (PUT request via Axios) */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300">
                Update Kitchen Stage:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Preparing')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-500/40 hover:bg-amber-900/80 cursor-pointer"
                >
                  Mark Preparing
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Out for Delivery')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/80 cursor-pointer"
                >
                  Dispatch Courier
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80 cursor-pointer"
                >
                  Mark Delivered
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Cancelled')}
                  className="p-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/60 cursor-pointer"
                  title="Cancel Order"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer & Delivery Address Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  <span>Customer Info</span>
                </div>
                <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
                {selectedOrder.customerEmail && (
                  <p className="text-xs text-slate-400">{selectedOrder.customerEmail}</p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>Drop-Off Address</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                  {selectedOrder.address}
                </p>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{selectedOrder.paymentMethod || 'Paid Online'}</span>
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Order Items ({selectedOrder.itemCount})
              </h5>
              <div className="divide-y divide-neutral-800">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-white font-medium">{item}</span>
                    <span className="text-emerald-400 font-bold text-xs">Prepared Fresh</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                <span className="text-xs text-slate-400 uppercase font-bold">Total Bill</span>
                <span className="text-xl font-black text-orange-400">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
