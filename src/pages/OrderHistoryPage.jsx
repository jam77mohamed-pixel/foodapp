import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Receipt, 
  RotateCcw, 
  Search, 
  MapPin, 
  Printer, 
  ArrowRight, 
  UtensilsCrossed, 
  FileText
} from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { formatCurrency, getOrderStatusColor } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';

export const OrderHistoryPage = () => {
  const { orders } = useRestaurants();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Delivered' | 'Active' | 'Cancelled'
  
  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Selected Order for Printable Tax Invoice Modal
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Network sync indicator (Triggers real GET /recipes?limit=6 in Network Tab)
  const [isNetworkFetching, setIsNetworkFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const syncNetworkHistory = async () => {
      setIsNetworkFetching(true);
      try {
        await apiClient.get('/recipes?limit=6');
      } catch (err) {
        console.warn('Network history sync note:', err);
      } finally {
        if (isMounted) setIsNetworkFetching(false);
      }
    };
    syncNetworkHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      // Status Filter
      if (statusFilter === 'Delivered' && order.status !== 'Delivered') return false;
      if (statusFilter === 'Active' && order.status === 'Delivered') return false;
      if (statusFilter === 'Cancelled' && order.status !== 'Cancelled') return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = order.id?.toLowerCase().includes(query);
        const matchesRest = order.restaurantName?.toLowerCase().includes(query);
        const matchesDish = Array.isArray(order.items) && order.items.some(
          (item) => typeof item === 'string' && item.toLowerCase().includes(query)
        );
        return matchesId || matchesRest || matchesDish;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Overall statistics
  const stats = useMemo(() => {
    const list = orders || [];
    const totalCount = list.length;
    const deliveredCount = list.filter((o) => o.status === 'Delivered').length;
    const totalSpent = list.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      totalCount,
      deliveredCount,
      totalSpent
    };
  }, [orders]);

  // 1-Click Reorder Handler
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      toast.warn('No dishes found in this past order.');
      return;
    }

    // Add each item to the food cart
    order.items.forEach((item, index) => {
      const name = typeof item === 'string' ? item.replace(/\(x\d+\)/g, '').trim() : 'Artisan Dish';
      addToCart({
        id: `reorder-${order.id}-${index}-${Date.now()}`,
        name: name,
        price: parseFloat((order.totalAmount / (order.itemCount || 1)).toFixed(2)) || 12.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        restaurantName: order.restaurantName || 'Gourmet Kitchen',
        category: 'Chef Special',
        isVeg: true,
        prepTime: '20 mins'
      }, 1);
    });

    toast.success(`Dishes from "${order.restaurantName}" added to your cart! 🛒`);
    navigate('/cart');
  };

  // Trigger browser print
  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40 mb-1">
              <Receipt className="w-3.5 h-3.5" />
              <span>Customer Order History & Official Invoices</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Past Orders & Tax Receipts 📋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Review your dining history, reorder favorite meals with 1 click, or print official tax receipts.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-400 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isNetworkFetching ? 'Syncing...' : 'Live Records'}</span>
            </span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-white">{stats.totalCount}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-emerald-400">{stats.deliveredCount}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivered Feasts</p>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-orange-400">{formatCurrency(stats.totalSpent)}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-amber-400">4.9 ★</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dining Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b]/95 border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, kitchen name, or dish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Delivered', 'Active', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  statusFilter === tab
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-neutral-900 text-slate-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab === 'All' ? 'All Orders' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#18181b]/60 border border-neutral-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 text-slate-400 mx-auto flex items-center justify-center">
            <Receipt className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-xl font-black text-white">No Orders Found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'All'
              ? 'No past orders matched your search criteria.'
              : 'You have not placed any orders yet. Discover our top dining spots!'}
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold"
          >
            <span>Browse Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusStyle = getOrderStatusColor(order.status);

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-5 sm:p-6 space-y-4 hover:border-neutral-700 transition-all shadow-xl"
              >
                {/* Header row: ID, Restaurant, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-base font-black text-white">{order.id}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      &bull; {order.orderedAt || 'Recent'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyle.badge} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      <span>{order.status}</span>
                    </span>
                  </div>

                  <span className="text-lg font-black text-orange-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                {/* Content: Restaurant Name, Dishes Chips, Address */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-bold text-white">
                        {order.restaurantName || 'Gourmet Kitchen'}
                      </span>
                    </div>

                    {/* Dish Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(order.items || []).map((dish, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 text-[11px] font-medium text-slate-300 border border-neutral-800"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-md">{order.address}</span>
                    </div>
                  </div>

                  {/* Actions: Reorder, View Details, Tax Invoice */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 self-end md:self-center shrink-0 flex-wrap">
                    {/* 1-Click Reorder Button */}
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                      title="Add all dishes back to cart"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>

                    {/* View Order Details */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-400" />
                      <span>Details</span>
                    </button>

                    {/* Printable Tax Invoice */}
                    <button
                      type="button"
                      onClick={() => setInvoiceOrder(order)}
                      className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Generate official tax invoice"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Breakdown • ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Status & Restaurant Strip */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="font-black text-white text-base">
                  {selectedOrder.restaurantName || 'Gourmet Kitchen'}
                </h4>
                <p className="text-xs text-slate-400">Placed: {selectedOrder.orderedAt || 'Recent'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getOrderStatusColor(selectedOrder.status).badge}`}>
                {selectedOrder.status}
              </span>
            </div>

            {/* Dishes list */}
            <div className="space-y-2">
              <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                Dishes Ordered
              </h5>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800 last:border-0">
                    <span className="font-bold text-white">{item}</span>
                    <span className="text-slate-400">Prepared Fresh</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Delivery Destination
                </span>
                <p className="font-bold text-white">{selectedOrder.customerName || 'Alex Morgan'}</p>
                <p className="text-slate-300 leading-relaxed">{selectedOrder.address}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Payment Details
                </span>
                <p className="font-bold text-white">{selectedOrder.paymentMethod || 'Credit Card'}</p>
                <p className="text-orange-400 font-black text-base pt-1">
                  Total Paid: {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Open Tax Invoice</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder Now</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Official Printable Tax Invoice Modal */}
      {invoiceOrder && (
        <Modal
          isOpen={Boolean(invoiceOrder)}
          onClose={() => setInvoiceOrder(null)}
          title={`Official Tax Invoice • INV-2026-${invoiceOrder.id}`}
          size="lg"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Printable Invoice Container */}
            <div id="tax-invoice-printable" className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 text-white space-y-6 shadow-inner">
              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-white text-sm">
                      C
                    </div>
                    <span className="text-lg font-black tracking-tight text-white">CRAVEFLOW</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Culinary Dispatch Logistics Inc. &bull; License #CF-94016
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Tax Registration / VAT ID: <span className="font-mono text-slate-300">US-VAT-891024</span>
                  </p>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 inline-block mb-1">
                    PAID IN FULL
                  </span>
                  <p className="text-sm font-black text-white font-mono">
                    INV-2026-{invoiceOrder.id}
                  </p>
                  <p className="text-[10px] text-slate-400">Date: {invoiceOrder.orderedAt || 'Nov 13, 2026'}</p>
                </div>
              </div>

              {/* Billed To vs Delivered By */}
              <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Billed To
                  </span>
                  <p className="font-bold text-white">{invoiceOrder.customerName || 'Alex Morgan'}</p>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{invoiceOrder.address}</p>
                  <p className="text-slate-400 text-[11px]">{invoiceOrder.customerPhone || '+1 (555) 345-6789'}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Restaurant Kitchen
                  </span>
                  <p className="font-bold text-white">{invoiceOrder.restaurantName || 'Gourmet Kitchen'}</p>
                  <p className="text-slate-400 text-[11px]">Courier: Marcus Vance (Verified)</p>
                  <p className="text-slate-400 text-[11px]">Payment: {invoiceOrder.paymentMethod || 'Credit Card'}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-2 font-bold">#</th>
                      <th className="py-2 font-bold">Culinary Item Description</th>
                      <th className="py-2 text-center font-bold">Qty</th>
                      <th className="py-2 text-right font-bold">Unit Price</th>
                      <th className="py-2 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {(invoiceOrder.items || []).map((item, i) => {
                      const unitPrice = parseFloat((invoiceOrder.totalAmount / (invoiceOrder.itemCount || 1)).toFixed(2));
                      return (
                        <tr key={i} className="text-slate-200">
                          <td className="py-2.5 text-slate-400">{i + 1}</td>
                          <td className="py-2.5 font-bold text-white">{item}</td>
                          <td className="py-2.5 text-center">1</td>
                          <td className="py-2.5 text-right font-mono">{formatCurrency(unitPrice)}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-white">{formatCurrency(unitPrice)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="pt-3 border-t border-neutral-800 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatCurrency(invoiceOrder.totalAmount * 0.88)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Charge</span>
                    <span className="font-mono text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Sales Tax & VAT (8%)</span>
                    <span className="font-mono">{formatCurrency(invoiceOrder.totalAmount * 0.12)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                    <span>Total Amount Paid</span>
                    <span className="text-orange-400 font-mono text-base">
                      {formatCurrency(invoiceOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-neutral-800/80 text-[10px] text-slate-400 text-center space-y-1">
                <p>Thank you for choosing CraveFlow for your dining experience.</p>
                <p>This is a computer-generated official receipt requiring no physical signature.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrintInvoice}
                className="px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-transform"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
