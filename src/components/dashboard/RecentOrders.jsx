import React, { useState } from 'react';
import { ShoppingBag, MapPin, Eye } from 'lucide-react';
import { formatCurrency, getOrderStatusColor } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export const RecentOrders = ({ orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'All') return true;
    return order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-5" id="orders">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Live & Recent Orders
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of kitchen prep, driver dispatches, and completed deliveries
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Restaurant</th>
              <th className="py-3 px-3">Items Ordered</th>
              <th className="py-3 px-3">Total</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  No orders found matching status "{statusFilter}".
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusStyle = getOrderStatusColor(order.status);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-900/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-orange-400">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                    </td>

                    {/* Restaurant */}
                    <td className="py-3.5 px-3 font-semibold text-slate-200">
                      {order.restaurantName}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <p className="truncate text-slate-300">
                        {order.items.join(', ')}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {order.itemCount} items &bull; {order.orderedAt}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-3 font-black text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{order.status}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white hover:border-orange-500/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder.id}`}
          subtitle={`Placed by ${selectedOrder.customerName} &bull; ${selectedOrder.orderedAt}`}
        >
          <div className="space-y-4">
            {/* Status Highlight */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Delivery Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getOrderStatusColor(selectedOrder.status).bg} ${getOrderStatusColor(selectedOrder.status).text} ${getOrderStatusColor(selectedOrder.status).border}`}
                  >
                    <span>{selectedOrder.status}</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    Est. Time: {selectedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold">Amount Paid</p>
                <p className="text-xl font-black text-orange-400 mt-0.5">
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
            </div>

            {/* Restaurant & Location */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span>Restaurant: {selectedOrder.restaurantName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Delivery Address: {selectedOrder.address}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Order Items ({selectedOrder.itemCount})
              </h5>
              <ul className="divide-y divide-neutral-800">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-white font-medium">{item}</span>
                    <span className="text-emerald-400 font-bold">Included</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
