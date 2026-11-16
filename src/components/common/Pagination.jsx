import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemLabel = 'restaurants'
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-neutral-800 text-slate-300">
      <div className="text-xs text-slate-400 font-medium">
        Showing <span className="font-bold text-white">{startItem}</span> to{' '}
        <span className="font-bold text-white">{endItem}</span> of{' '}
        <span className="font-bold text-orange-400">{totalItems}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-xs font-semibold text-slate-300 hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                p === currentPage
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                  : 'bg-neutral-900/80 border border-neutral-800 text-slate-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-xs font-semibold text-slate-300 hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
