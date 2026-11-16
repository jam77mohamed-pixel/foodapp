import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  PlusCircle, 
  RotateCcw, 
  AlertCircle
} from 'lucide-react';
import { useRestaurants } from '../context/RestaurantContext';
import { RestaurantCard } from '../components/restaurants/RestaurantCard';
import { RestaurantFilters } from '../components/restaurants/RestaurantFilters';
import { RestaurantDetailsModal } from '../components/restaurants/RestaurantDetailsModal';
import { Pagination } from '../components/common/Pagination';
import { RestaurantSkeletonCard } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

export const RestaurantsPage = () => {
  const {
    paginatedRestaurants,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isLoading,
    error,
    retryFetch,
    setSearchQuery,
    setSelectedCuisine,
    setRatingFilter,
    setOnlyOpen,
    setOnlyFreeDelivery,
    setIsAddRestaurantModalOpen
  } = useRestaurants();

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setRatingFilter('All');
    setOnlyOpen(false);
    setOnlyFreeDelivery(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/08 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40 mb-2 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Verified Dining Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Restaurant Listing & Menus
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Explore curated gourmet kitchens, authentic global cuisines, live delivery ratings, and culinary dishes
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={retryFetch}
              className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh directory"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsAddRestaurantModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Restaurant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b]/95 border border-neutral-800 shadow-xl">
        <RestaurantFilters />
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{error}</p>
          </div>
          <button
            type="button"
            onClick={retryFetch}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Restaurant Grid / Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RestaurantSkeletonCard key={i} />
          ))}
        </div>
      ) : paginatedRestaurants.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No restaurants match your filters"
          description="We couldn't find any dining spots matching your current search terms or cuisine selection. Try clearing or expanding your filters."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onViewDetails={(r) => setSelectedRestaurant(r)}
              />
            ))}
          </div>

          {/* Reusable Pagination */}
          <div className="p-2 rounded-2xl bg-[#18181b]/80 border border-neutral-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={totalItems}
              pageSize={itemsPerPage}
              itemLabel="restaurants"
            />
          </div>
        </div>
      )}

      {/* Restaurant Quick Details Modal */}
      <RestaurantDetailsModal
        restaurant={selectedRestaurant}
        isOpen={Boolean(selectedRestaurant)}
        onClose={() => setSelectedRestaurant(null)}
      />
    </div>
  );
};
