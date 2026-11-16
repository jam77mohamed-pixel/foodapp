import React, { useState } from 'react';
import { 
  PlusCircle, 
  UtensilsCrossed, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Leaf, 
  RefreshCw 
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { MenuFilters } from '../components/menu/MenuFilters';
import { MenuItemFormModal } from '../components/menu/MenuItemFormModal';
import { DeleteConfirmModal } from '../components/menu/DeleteConfirmModal';
import { MenuSkeletonCard } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';

export const MenuPage = () => {
  const {
    isLoading,
    error,
    filteredMenuItems,
    paginatedMenuItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    vegFilter,
    setVegFilter,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    resetFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    menuStats,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    isAddMenuModalOpen,
    setIsAddMenuModalOpen,
    editingItem,
    setEditingItem,
    deletingItem,
    setDeletingItem
  } = useMenu();

  const [activeFormModalOpen, setActiveFormModalOpen] = useState(false);

  // Open modal in create mode
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setActiveFormModalOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setActiveFormModalOpen(true);
  };

  // Close form modal
  const handleCloseFormModal = () => {
    setActiveFormModalOpen(false);
    setEditingItem(null);
    setIsAddMenuModalOpen(false);
  };

  // Handle Form Submission (Add or Edit)
  const handleFormSubmit = async (formData) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
    } else {
      addMenuItem(formData);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Top Banner & Action Header */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 text-white p-6 sm:p-8 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_15px_rgba(249,115,22,0.1)]">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Artisan Culinary Catalog</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Culinary Menu Catalog 🍕
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Explore freshly synchronized gourmet recipes, manage prices, toggle kitchen stock availability, and organize dishes by category and dietary preferences.
            </p>
          </div>

          {/* "+ Add New Dish" Primary Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-3 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Dish</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Items */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Dishes</p>
            <p className="text-xl sm:text-2xl font-black text-white">{menuStats.total}</p>
          </div>
        </div>

        {/* In Stock */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Stock</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">{menuStats.available}</p>
          </div>
        </div>

        {/* Pure Veg */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pure Veg</p>
            <p className="text-xl sm:text-2xl font-black text-teal-400">{menuStats.vegCount}</p>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#18181b]/95 border border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-xl sm:text-2xl font-black text-rose-400">{menuStats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Interactive Filters & Search Component */}
      <MenuFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        vegFilter={vegFilter}
        onVegFilterChange={setVegFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={resetFilters}
        totalResults={filteredMenuItems.length}
      />

      {/* Main Content Area */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 font-bold underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Dishes</span>
          </button>
        </div>
      )}

      {/* Grid or Skeleton Loader */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <MenuSkeletonCard key={n} />
          ))}
        </div>
      ) : paginatedMenuItems.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No food items match your criteria"
          description="Try broadening your search keyword, choosing a different category, or clearing active filters."
          actionLabel="Clear All Filters"
          onAction={resetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paginatedMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={handleOpenEditModal}
                onDelete={(target) => setDeletingItem(target)}
                onToggleAvailability={toggleAvailability}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredMenuItems.length}
            pageSize={itemsPerPage}
            itemLabel="dishes"
          />
        </>
      )}

      {/* Add / Edit Menu Item Modal */}
      <MenuItemFormModal
        isOpen={activeFormModalOpen || isAddMenuModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={(id) => deleteMenuItem(id)}
      />
    </div>
  );
};
