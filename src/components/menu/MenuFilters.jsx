import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  ArrowUpDown, 
  Sparkles, 
  Leaf, 
  Drumstick,
  CheckCircle2
} from 'lucide-react';
import { CATEGORY_PRESETS } from '../../api/menuApi';

export const MenuFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  vegFilter,
  onVegFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults
}) => {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    (selectedCategory && selectedCategory !== 'All') ||
    vegFilter !== 'all' ||
    availabilityFilter !== 'all' ||
    sortBy !== 'recommended';

  return (
    <div className="space-y-4 rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-4 sm:p-6 shadow-xl">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by food name, description, ingredients, or cuisine..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 transition-all outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white bg-neutral-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort by Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none pl-10 pr-9 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white font-medium cursor-pointer transition-all outline-hidden"
            >
              <option value="recommended">Sort: Popular & Best</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
              <option value="rating-high">Sort: Highest Customer Rating</option>
              <option value="name-asc">Sort: Name (A to Z)</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-orange-400 hover:text-orange-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Middle: Dietary (Veg / Non-Veg) & Stock Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-800/80">
        {/* Diet Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => onVegFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              vegFilter === 'all'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Diets
          </button>
          <button
            type="button"
            onClick={() => onVegFilterChange('veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              vegFilter === 'veg'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pure Veg</span>
          </button>
          <button
            type="button"
            onClick={() => onVegFilterChange('non-veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              vegFilter === 'non-veg'
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <Drumstick className="w-3.5 h-3.5 text-rose-400" />
            <span>Non-Veg</span>
          </button>
        </div>

        {/* Availability Status Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => onAvailabilityFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              availabilityFilter === 'all'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Status
          </button>
          <button
            type="button"
            onClick={() => onAvailabilityFilterChange('available')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              availabilityFilter === 'available'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>In Stock</span>
          </button>
          <button
            type="button"
            onClick={() => onAvailabilityFilterChange('unavailable')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              availabilityFilter === 'unavailable'
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <span>Out of Stock</span>
          </button>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-400 font-semibold">
          Showing <span className="text-orange-400 font-bold">{totalResults}</span> dish{totalResults === 1 ? '' : 'es'}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="pt-2 border-t border-neutral-800/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pr-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Category:
          </span>
          {CATEGORY_PRESETS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'btn-gradient-glow text-white shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
