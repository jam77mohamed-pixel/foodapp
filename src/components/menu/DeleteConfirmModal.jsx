import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DeleteConfirmModal = ({
  isOpen,
  item,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#18181b] border border-neutral-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(239,68,68,0.2)] text-white p-6 sm:p-7 space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Title & Warning */}
        <div>
          <h3 className="text-lg font-black text-white">Delete Menu Item?</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Are you sure you want to permanently remove this dish from your restaurant menu? This action cannot be undone.
          </p>
        </div>

        {/* Item Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span className="text-orange-400 font-bold">{formatCurrency(item.price)}</span>
              <span>•</span>
              <span>{item.category}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Keep Item
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Yes, Delete Dish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
