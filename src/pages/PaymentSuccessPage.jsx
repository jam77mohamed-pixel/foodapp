import React, { useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Truck, 
  Receipt, 
  Home, 
  Clock, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();

  const order = location.state?.order;
  const paymentMethod = location.state?.paymentMethod || 'Credit Card (Verified)';
  
  // Stable transaction ID
  const txnId = useMemo(() => {
    return location.state?.txnId || `TXN-${orderId ? orderId.replace(/\D/g, '') || '581902' : '581902'}-PAY`;
  }, [location.state?.txnId, orderId]);

  const displayOrderId = orderId || order?.id || 'CRV-8921';
  const totalAmount = order?.totalAmount || 38.50;

  return (
    <div className="py-12 sm:py-16 px-4 max-w-2xl mx-auto animate-fade-in text-center space-y-8">
      {/* Celebration Checkmark */}
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-[0_0_35px_rgba(16,185,129,0.4)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#18181b] flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 inline-block">
          Payment Authorized & Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Feast is on the Way! 🍕
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Your payment was processed successfully. The kitchen has received your order and started culinary preparations.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 text-left space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Order Reference
            </span>
            <span className="text-base font-black text-white">{displayOrderId}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Transaction ID
            </span>
            <span className="text-xs font-mono font-bold text-orange-400">{txnId}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
              Payment Gateway
            </span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{paymentMethod}</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
              Total Amount Paid
            </span>
            <p className="text-base font-black text-orange-400">
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
              Estimated Delivery
            </span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>25 - 35 Minutes</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
              Delivery Type
            </span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              <span>Contactless Courier</span>
            </p>
          </div>
        </div>

        {/* Courier notification banner */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Digital receipt has been generated and saved to your account.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/tracking/${displayOrderId}`}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Live</span>
        </Link>

        <Link
          to="/order-history"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Receipt className="w-4 h-4 text-orange-400" />
          <span>Past Orders & Invoices</span>
        </Link>

        <Link
          to="/restaurants"
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Explore More</span>
        </Link>
      </div>
    </div>
  );
};
