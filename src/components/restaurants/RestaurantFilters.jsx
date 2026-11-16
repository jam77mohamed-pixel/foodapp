import React from 'react';
import { 
  Search, 
  Star, 
  RotateCcw, 
  SlidersHorizontal, 
  Bike, 
  Clock, 
  X
} from 'lucide-react';
import { useRestaurants } from '../../context/RestaurantContext';

export const RestaurantFilters = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCuisine,
    setSelectedCuisine,
    cuisineList,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    onlyOpen,
    setOnlyOpen,
    onlyFreeDelivery,
    setOnlyFreeDelivery,
    totalItems
  } = useRestaurants();

  const isFiltered =
    searchQuery ||
    selectedCuisine !== 'All' ||
    ratingFilter !== 'All' ||
    sortBy !== 'popularity' ||
    onlyOpen ||
    onlyFreeDelivery;

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setRatingFilter('All');
    setSortBy('popularity');
    setOnlyOpen(false);
    setOnlyFreeDelivery(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar + Sort & View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants by name, cuisine, address, or dishes..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-md"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold text-slate-200 focus:outline-none focus:border-orange-500 transition-all cursor-pointer shadow-md"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="rating">Sort by: Highest Rating</option>
              <option value="deliveryTime">Sort by: Fastest Delivery</option>
              <option value="deliveryFee">Sort by: Lowest Delivery Fee</option>
            </select>
            <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500 text-orange-400 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Cuisine Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {cuisineList.map((cuisine) => {
          const isSelected = selectedCuisine.toLowerCase() === cuisine.toLowerCase();
          return (
            <button
              key={cuisine}
              type="button"
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                  : 'bg-neutral-900/80 border border-neutral-800 text-slate-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cuisine}
            </button>
          );
        })}
      </div>

      {/* Secondary Quick Filter Pills (Rating & Delivery status) */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-300 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Rating:
          </span>
          {['All', '4.5', '4.0', '3.5'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setRatingFilter(val)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                ratingFilter === val
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-white'
              }`}
            >
              {val !== 'All' && <Star className="w-3 h-3 fill-current" />}
              <span>{val === 'All' ? 'All Ratings' : `${val}+`}</span>
            </button>
          ))}

          {/* Open Now Toggle */}
          <button
            type="button"
            onClick={() => setOnlyOpen(!onlyOpen)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              onlyOpen
                ? 'bg-emerald-500 text-black shadow-xs'
                : 'bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Open Now</span>
          </button>

          {/* Free Delivery Toggle */}
          <button
            type="button"
            onClick={() => setOnlyFreeDelivery(!onlyFreeDelivery)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              onlyFreeDelivery
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3 h-3" />
            <span>Free Delivery</span>
          </button>
        </div>

        {/* Count Indicator */}
        <div className="text-[11px] text-slate-400 font-medium ml-auto">
          Found <span className="font-bold text-orange-400">{totalItems}</span> matching places
        </div>
      </div>
    </div>
  );
};
