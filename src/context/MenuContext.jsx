import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchMenuItems, saveMenuItemsToStorage } from '../api/menuApi';

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'unavailable'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-low' | 'price-high' | 'rating-high' | 'name-asc'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal dialog states
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null or item object
  const [deletingItem, setDeletingItem] = useState(null); // null or item object

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMenuItems();
        if (isMounted) {
          setMenuItems(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Menu load error:', err);
          setError('Failed to load menu items. Displaying backup dishes.');
          toast.error('Unable to fetch live menu. Using saved menu items.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered and Sorted Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = item.name?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          const matchCat = item.category?.toLowerCase().includes(query);
          const matchRest = item.restaurantName?.toLowerCase().includes(query);
          const matchIngr = Array.isArray(item.ingredients) &&
            item.ingredients.some(ing => ing.toLowerCase().includes(query));
          
          if (!matchName && !matchDesc && !matchCat && !matchRest && !matchIngr) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && selectedCategory !== 'All') {
          if (item.category !== selectedCategory) {
            return false;
          }
        }

        // Veg / Non-Veg filter
        if (vegFilter === 'veg' && !item.isVeg) return false;
        if (vegFilter === 'non-veg' && item.isVeg) return false;

        // Availability filter
        if (availabilityFilter === 'available' && !item.isAvailable) return false;
        if (availabilityFilter === 'unavailable' && item.isAvailable) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'rating-high':
            return (b.rating || 0) - (a.rating || 0);
          case 'name-asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'recommended':
          default:
            return (b.rating || 0) * (b.reviewCount || 1) - (a.rating || 0) * (a.reviewCount || 1);
        }
      });
  }, [menuItems, searchQuery, selectedCategory, vegFilter, availabilityFilter, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, vegFilter, availabilityFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage) || 1;
  const paginatedMenuItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMenuItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMenuItems, currentPage, itemsPerPage]);

  // Statistics for Dashboard and Menu header
  const menuStats = useMemo(() => {
    const total = menuItems.length;
    const available = menuItems.filter(i => i.isAvailable).length;
    const outOfStock = total - available;
    const vegCount = menuItems.filter(i => i.isVeg).length;
    const nonVegCount = total - vegCount;
    return {
      total,
      available,
      outOfStock,
      vegCount,
      nonVegCount
    };
  }, [menuItems]);

  // CRUD Actions
  // 1. Add Menu Item
  const addMenuItem = useCallback((formData) => {
    const newItem = {
      id: `food-custom-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category || 'Burgers',
      price: parseFloat(formData.price) || 9.99,
      isVeg: Boolean(formData.isVeg),
      isAvailable: formData.isAvailable !== undefined ? Boolean(formData.isAvailable) : true,
      restaurantName: formData.restaurantName?.trim() || 'CraveFlow Kitchen',
      image: formData.image?.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      description: formData.description?.trim() || 'Delicious chef special made with fresh authentic ingredients.',
      rating: 4.8,
      reviewCount: 1,
      prepTime: formData.prepTime?.trim() || '15-20 mins',
      calories: formData.calories?.trim() || '450 kcal',
      ingredients: Array.isArray(formData.ingredients)
        ? formData.ingredients
        : (formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()).filter(Boolean) : ['Chef secret spices', 'Organic ingredients']),
      instructions: formData.instructions?.trim() || 'Prepared fresh upon order confirmation.'
    };

    setMenuItems((prev) => {
      const updated = [newItem, ...prev];
      saveMenuItemsToStorage(updated);
      return updated;
    });

    toast.success(`"${newItem.name}" added to the menu! 🍽️`);
    return newItem;
  }, []);

  // 2. Edit / Update Menu Item
  const updateMenuItem = useCallback((id, updatedData) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedData,
            price: updatedData.price !== undefined ? parseFloat(updatedData.price) : item.price,
            ingredients: Array.isArray(updatedData.ingredients)
              ? updatedData.ingredients
              : (typeof updatedData.ingredients === 'string'
                  ? updatedData.ingredients.split(',').map(s => s.trim()).filter(Boolean)
                  : item.ingredients)
          };
        }
        return item;
      });
      saveMenuItemsToStorage(updated);
      return updated;
    });

    toast.success(`"${updatedData.name || 'Dish'}" updated successfully! ✨`);
  }, []);

  // 3. Delete Menu Item
  const deleteMenuItem = useCallback((id) => {
    setMenuItems((prev) => {
      const target = prev.find(i => i.id === id);
      const name = target ? target.name : 'Item';
      const updated = prev.filter(item => item.id !== id);
      saveMenuItemsToStorage(updated);
      toast.info(`"${name}" removed from the menu.`);
      return updated;
    });
  }, []);

  // 4. Toggle Availability Status
  const toggleAvailability = useCallback((id) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.isAvailable;
          toast.info(`"${item.name}" marked as ${newStatus ? 'In Stock (Available)' : 'Out of Stock'}.`);
          return { ...item, isAvailable: newStatus };
        }
        return item;
      });
      saveMenuItemsToStorage(updated);
      return updated;
    });
  }, []);

  // Helper to fetch single item
  const getMenuItemById = useCallback((id) => {
    return menuItems.find(item => String(item.id) === String(id));
  }, [menuItems]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVegFilter('all');
    setAvailabilityFilter('all');
    setSortBy('recommended');
    setCurrentPage(1);
  }, []);

  const value = {
    menuItems,
    isLoading,
    error,
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
    filteredMenuItems,
    paginatedMenuItems,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    menuStats,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getMenuItemById,
    resetFilters,
    isAddMenuModalOpen,
    setIsAddMenuModalOpen,
    editingItem,
    setEditingItem,
    deletingItem,
    setDeletingItem
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
