import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RestaurantsPage } from '../pages/RestaurantsPage';
import { RestaurantDetailsPage } from '../pages/RestaurantDetailsPage';
import { MenuPage } from '../pages/MenuPage';
import { FoodDetailsPage } from '../pages/FoodDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { PaymentSuccessPage } from '../pages/PaymentSuccessPage';
import { PaymentFailurePage } from '../pages/PaymentFailurePage';
import { OrderTrackingPage } from '../pages/OrderTrackingPage';
import { OrdersPage } from '../pages/OrdersPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Operations Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Restaurant Listing & Details */}
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />

        {/* Menu Catalog & Food Details */}
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<FoodDetailsPage />} />

        {/* Cart Management */}
        <Route path="cart" element={<CartPage />} />

        {/* Order Placement & Confirmation */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />

        {/* Payment Gateway Flows */}
        <Route path="payment-success/:orderId" element={<PaymentSuccessPage />} />
        <Route path="payment-failure" element={<PaymentFailurePage />} />

        {/* Order Tracking */}
        <Route path="tracking" element={<OrderTrackingPage />} />
        <Route path="tracking/:orderId" element={<OrderTrackingPage />} />

        {/* Live & Recent Orders Feed */}
        <Route path="orders" element={<OrdersPage />} />

        {/* Order History & Tax Receipts */}
        <Route path="order-history" element={<OrderHistoryPage />} />

        {/* Customer Profile & Delivery Addresses */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
