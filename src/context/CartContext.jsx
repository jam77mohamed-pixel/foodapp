import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getStorageItem, setStorageItem } from '../utils/storage';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'foodapp_cart_v1';
const COUPON_STORAGE_KEY = 'foodapp_coupon_v1';
const FREE_DELIVERY_THRESHOLD = 35.00;
const STANDARD_DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08; // 8% sales tax

// Curated promo coupons available for customers
export const AVAILABLE_COUPONS = [
  {
    code: 'WELCOME50',
    title: '50% OFF First Order',
    description: 'Get 50% discount up to $15 on your feast',
    badge: 'Popular',
    type: 'percent',
    value: 50,
    maxDiscount: 15.00,
    minOrder: 0
  },
  {
    code: 'CRAVE20',
    title: '20% OFF Entire Cart',
    description: 'Save 20% across all dishes in your cart',
    badge: 'Trending',
    type: 'percent',
    value: 20,
    maxDiscount: null,
    minOrder: 0
  },
  {
    code: 'FREESHIP',
    title: 'Zero Delivery Fee',
    description: 'Enjoy 100% free courier delivery',
    badge: 'Fast',
    type: 'shipping',
    value: 100,
    maxDiscount: null,
    minOrder: 0
  },
  {
    code: 'FEAST10',
    title: '$10 OFF over $35',
    description: 'Flat $10 savings on orders of $35 or more',
    badge: 'Saver',
    type: 'flat',
    value: 10.00,
    maxDiscount: 10.00,
    minOrder: 35.00
  }
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    return getStorageItem(CART_STORAGE_KEY, []);
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return getStorageItem(COUPON_STORAGE_KEY, null);
  });

  // Persist cart to LocalStorage whenever it changes
  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, cartItems);
  }, [cartItems]);

  // Persist coupon
  useEffect(() => {
    setStorageItem(COUPON_STORAGE_KEY, appliedCoupon);
  }, [appliedCoupon]);

  // Add an item to the cart
  const addToCart = useCallback((item, quantity = 1) => {
    if (!item) return;

    if (item.isAvailable === false) {
      toast.warn(`"${item.name}" is currently out of stock.`);
      return;
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + qtyToAdd;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        toast.success(`Updated "${item.name}" quantity to ${newQty}! 🛒`);
        return updated;
      } else {
        const newItem = {
          id: item.id,
          name: item.name,
          price: parseFloat(item.price) || 9.99,
          image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          restaurantName: item.restaurantName || 'Gourmet Kitchen',
          category: item.category || 'Dishes',
          isVeg: Boolean(item.isVeg),
          prepTime: item.prepTime || '20 mins',
          quantity: qtyToAdd
        };
        toast.success(`Added ${qtyToAdd}x "${item.name}" to cart! 🍽️`);
        return [newItem, ...prevItems];
      }
    });
  }, []);

  // Remove an item from the cart
  const removeFromCart = useCallback((itemId) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((i) => i.id === itemId);
      const name = target ? target.name : 'Item';
      const updated = prevItems.filter((i) => i.id !== itemId);
      toast.info(`"${name}" removed from cart.`);
      return updated;
    });
  }, []);

  // Update quantity of an item
  const updateQuantity = useCallback((itemId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      setCartItems((prevItems) => {
        const target = prevItems.find((i) => i.id === itemId);
        const name = target ? target.name : 'Item';
        const updated = prevItems.filter((i) => i.id !== itemId);
        toast.info(`"${name}" removed from cart.`);
        return updated;
      });
      return;
    }

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: qty };
        }
        return item;
      });
    });
  }, []);

  // Clear all items from the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setStorageItem(CART_STORAGE_KEY, []);
    setAppliedCoupon(null);
    setStorageItem(COUPON_STORAGE_KEY, null);
  }, []);

  // Check how many of a specific item are in the cart
  const getItemQuantity = useCallback((itemId) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  }, [cartItems]);

  // Apply Coupon Method
  const applyCoupon = useCallback((couponCode) => {
    if (!couponCode || !couponCode.trim()) {
      toast.error('Please enter a coupon code.');
      return false;
    }

    const cleanCode = couponCode.trim().toUpperCase();
    const matched = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!matched) {
      toast.error(`Invalid code "${cleanCode}". Try WELCOME50, CRAVE20, FREESHIP, or FEAST10.`);
      return false;
    }

    // Check minimum order requirement
    const currentSubtotal = cartItems.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
      0
    );

    if (matched.minOrder && currentSubtotal < matched.minOrder) {
      toast.warn(`"${cleanCode}" requires a minimum order of $${matched.minOrder.toFixed(2)}. Add more items!`);
      return false;
    }

    setAppliedCoupon(matched);
    toast.success(`Coupon "${matched.code}" applied! 🎉 ${matched.title}`);
    return true;
  }, [cartItems]);

  // Remove Coupon Method
  const removeCoupon = useCallback(() => {
    if (appliedCoupon) {
      const code = appliedCoupon.code;
      setAppliedCoupon(null);
      toast.info(`Coupon "${code}" removed.`);
    }
  }, [appliedCoupon]);

  // Financial and quantity calculations
  const totals = useMemo(() => {
    const totalItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
      0
    );

    const isEligibleForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0;
    const baseDeliveryFee = subtotal === 0 ? 0 : (isEligibleForFreeDelivery ? 0 : STANDARD_DELIVERY_FEE);
    const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
    const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

    const tax = subtotal * TAX_RATE;

    // Calculate coupon discount
    let discountAmount = 0;
    let effectiveDeliveryFee = baseDeliveryFee;

    if (appliedCoupon && subtotal > 0) {
      if (appliedCoupon.code === 'WELCOME50') {
        // 50% off up to $15
        discountAmount = Math.min(appliedCoupon.maxDiscount || 15.00, subtotal * 0.50);
      } else if (appliedCoupon.code === 'CRAVE20') {
        // 20% off subtotal
        discountAmount = subtotal * 0.20;
      } else if (appliedCoupon.code === 'FREESHIP') {
        // Waive delivery fee
        discountAmount = baseDeliveryFee;
        effectiveDeliveryFee = 0;
      } else if (appliedCoupon.code === 'FEAST10') {
        // $10 off if subtotal >= 35
        if (subtotal >= 35.00) {
          discountAmount = 10.00;
        }
      }
    }

    const finalTotalPrice = Math.max(0, subtotal + effectiveDeliveryFee + tax - (appliedCoupon?.code === 'FREESHIP' ? 0 : discountAmount));

    return {
      totalItemCount,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee: parseFloat(effectiveDeliveryFee.toFixed(2)),
      isEligibleForFreeDelivery,
      amountNeededForFreeDelivery: parseFloat(amountNeededForFreeDelivery.toFixed(2)),
      freeDeliveryProgress: Math.round(freeDeliveryProgress),
      tax: parseFloat(tax.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      totalPrice: parseFloat(finalTotalPrice.toFixed(2)),
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD
    };
  }, [cartItems, appliedCoupon]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons: AVAILABLE_COUPONS,
    ...totals
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
