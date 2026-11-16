import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  XCircle, 
  RotateCcw, 
  CreditCard, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';

export const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId') || 'CRV-DECLINED';
  const amount = parseFloat(searchParams.get('amount')) || 38.50;

  const handleContactSupport = () => {
    toast.info('CraveFlow Priority Support: 1-800-555-CRAVE (Available 24/7)');
  };

  return (
    <div className="py-12 sm:py-16 px-4 max-w-2xl mx-auto animate-fade-in text-center space-y-8">
      {/* Declined Warning Icon */}
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-1 shadow-[0_0_35px_rgba(244,63,94,0.4)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#18181b] flex items-center justify-center">
            <XCircle className="w-12 h-12 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/40 inline-block">
          Payment Authorization Declined
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Payment Could Not Be Processed
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Your financial institution declined the transaction. No charges have been deducted from your account. Your cart items are safely preserved.
        </p>
      </div>

      {/* Decline Reasons Card */}
      <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 text-left space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Attempted Order Reference
            </span>
            <span className="text-base font-black text-white">{orderId}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Attempted Amount
            </span>
            <span className="text-base font-black text-rose-400">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">Common Reasons for Decline:</span>
              <ul className="text-slate-300 list-disc list-inside space-y-0.5 text-[11px]">
                <li>Temporary bank server or 3D Secure verification timeout</li>
                <li>Incorrect CVV or expiration date entered</li>
                <li>Daily spending limit reached on your card</li>
                <li>Insufficient available credit or balance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Try an alternate card or switch to Instant UPI for 100% success.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again / Retry Payment</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <CreditCard className="w-4 h-4 text-orange-400" />
          <span>Choose Alternate Gateway</span>
        </button>

        <button
          type="button"
          onClick={handleContactSupport}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Support</span>
        </button>
      </div>
    </div>
  );
};
