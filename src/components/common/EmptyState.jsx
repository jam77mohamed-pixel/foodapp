import React from 'react';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = UtensilsCrossed,
  title = 'No items found',
  description = 'Try adjusting your search query or reset your filters to see more results.',
  actionLabel = 'Reset Filters',
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-[#18181b]/50 border border-neutral-800/80 my-6">
      <div className="w-16 h-16 rounded-3xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center mb-4 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
