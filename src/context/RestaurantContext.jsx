import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchRestaurantsFromApi, saveNewRestaurant } from '../api/restaurantApi';
import { 
  fetchLiveOrdersFromApi, 
  createLiveOrderApi, 
  updateOrderStatusApi, 
  FALLBACK_SEED_ORDERS 
} from '../api/orderApi';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { toast } from 'react-toastify';

const RestaurantContext = createContext(null);

const STORAGE_ORDERS_KEY = 'foodapp_orders_v1';

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popularity'); // popularity, rating, deliveryTime, deliveryFee
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Live Orders State (connected to Third-Party API via Axios)
  const [orders, setOrders] = useState(() => {
    return getStorageItem(STORAGE_ORDERS_KEY, FALLBACK_SEED_ORDERS);
  });
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('Just now');

  // Load restaurants on mount
  const loadRestaurants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRestaurantsFromApi();
      setRestaurants(data);
    } catch {
      setError('Unable to load restaurants. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load live orders on mount using Axios
  const loadOrders = useCallback(async (isManualRefresh = false) => {
    setIsOrdersLoading(true);
    try {
      const data = await fetchLiveOrdersFromApi();
      setOrders(data);
      setLastSyncedTime(new Date().toLocaleTimeString());
      if (isManualRefresh) {
        toast.success('Order feed refreshed with latest updates! 📋');
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
      if (isManualRefresh) {
        toast.warn('Using cached orders from local storage.');
      }
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
    loadOrders();
  }, [loadRestaurants, loadOrders]);

  // Persist orders whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_ORDERS_KEY, orders);
  }, [orders]);

  // Extract all unique cuisine types for the filter tabs
  const cuisineList = useMemo(() => {
    const list = new Set(['All']);
    restaurants.forEach((r) => {
      if (r.cuisine) list.add(r.cuisine);
    });
    return Array.from(list);
  }, [restaurants]);

  // Filtered & Sorted restaurant list
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Search query filter (matches name, cuisine, address, or dishes)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query) ||
          (r.dishes && r.dishes.some((d) => d.name.toLowerCase().includes(query)))
      );
    }

    // Cuisine filter
    if (selectedCuisine && selectedCuisine !== 'All') {
      result = result.filter((r) => r.cuisine.toLowerCase() === selectedCuisine.toLowerCase());
    }

    // Rating filter
    if (ratingFilter !== 'All') {
      const minRating = parseFloat(ratingFilter);
      result = result.filter((r) => r.rating >= minRating);
    }

    // Only Open Filter
    if (onlyOpen) {
      result = result.filter((r) => r.isOpen);
    }

    // Only Free Delivery Filter
    if (onlyFreeDelivery) {
      result = result.filter((r) => r.deliveryFee === 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'deliveryTime') {
        const timeA = parseInt(a.deliveryTime, 10) || 30;
        const timeB = parseInt(b.deliveryTime, 10) || 30;
        return timeA - timeB;
      }
      if (sortBy === 'deliveryFee') {
        return a.deliveryFee - b.deliveryFee;
      }
      // Default: popularity
      return (b.reviewCount || 0) * (b.rating || 1) - (a.reviewCount || 0) * (a.rating || 1);
    });

    return result;
  }, [restaurants, searchQuery, selectedCuisine, ratingFilter, sortBy, onlyOpen, onlyFreeDelivery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCuisine, ratingFilter, sortBy, onlyOpen, onlyFreeDelivery]);

  // Pagination Slicing
  const totalItems = filteredRestaurants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRestaurants, currentPage, itemsPerPage]);

  // Method to add new restaurant
  const addRestaurant = useCallback((newRestaurantData) => {
    const created = saveNewRestaurant(newRestaurantData);
    setRestaurants((prev) => [created, ...prev]);
    return created;
  }, []);

  // Method to get a single restaurant by ID
  const getRestaurantById = useCallback(
    (id) => {
      return restaurants.find((r) => String(r.id) === String(id));
    },
    [restaurants]
  );

  // Method to create a live order via Axios POST
  const createLiveOrder = useCallback(async (orderData) => {
    setIsOrdersLoading(true);
    try {
      const result = await createLiveOrderApi(orderData);
      setOrders((prev) => [result.order, ...prev]);
      toast.success(`Order ${result.order.id} confirmed with the kitchen! 🍕`);
      return result.order;
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  // Method to update order status via Axios PUT
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    const updated = await updateOrderStatusApi(orderId, newStatus);
    setOrders(updated);
    toast.info(`Order ${orderId} updated to: ${newStatus}`);
  }, []);

  // Compute live Dashboard Statistics
  const dashboardStats = useMemo(() => {
    const totalRestaurantsCount = restaurants.length;
    
    // Total food dishes across restaurants
    const totalFoodItemsCount = restaurants.reduce(
      (sum, r) => sum + (r.dishes ? r.dishes.length : 0),
      0
    );

    // Order statistics
    const totalOrdersCount = orders.length;
    const activeOrdersCount = orders.filter(
      (o) => o.status === 'Preparing' || o.status === 'Out for Delivery'
    ).length;
    const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

    // Total unique customers
    const uniqueCustomers = new Set(orders.map((o) => o.customerName));
    const totalCustomersCount = uniqueCustomers.size + 142; // Base customers + active

    // Revenue calculation from delivered orders + baseline
    const completedRevenue = orders
      .filter((o) => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRevenue = 14850.50 + completedRevenue;

    return {
      totalRestaurants: totalRestaurantsCount,
      totalFoodItems: totalFoodItemsCount,
      totalOrders: totalOrdersCount + 328, // Lifetime total orders
      activeOrders: activeOrdersCount,
      deliveredOrders: deliveredOrdersCount + 312,
      totalCustomers: totalCustomersCount,
      totalRevenue: totalRevenue,
      recentOrders: orders
    };
  }, [restaurants, orders]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        filteredRestaurants,
        paginatedRestaurants,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        isLoading,
        error,
        retryFetch: loadRestaurants,
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
        isAddRestaurantModalOpen,
        setIsAddRestaurantModalOpen,
        addRestaurant,
        getRestaurantById,
        orders,
        setOrders,
        isOrdersLoading,
        lastSyncedTime,
        refreshOrders: () => loadOrders(true),
        createLiveOrder,
        updateOrderStatus,
        dashboardStats,
        recentOrders: orders
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
};
