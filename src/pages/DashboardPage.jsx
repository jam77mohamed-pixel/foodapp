import React from 'react';
import { 
  UtensilsCrossed, 
  Pizza, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useMenu } from '../context/MenuContext';
import { StatCard } from '../components/common/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentOrders } from '../components/dashboard/RecentOrders';
import { TopCuisines } from '../components/dashboard/TopCuisines';
import { DashboardStatsSkeleton } from '../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { dashboardStats, restaurants, isLoading, setIsAddRestaurantModalOpen } = useRestaurants();
  const { menuStats } = useMenu();

  const totalFoodItemsCount = menuStats?.total || dashboardStats.totalFoodItems || 30;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Top Welcome Hero Banner */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 text-white p-6 sm:p-9 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_15px_rgba(249,115,22,0.1)]">
        {/* Ambient neon gradient blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>CraveFlow Operations Control</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Welcome back, {user?.name || 'Manager'}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Managing <span className="text-orange-400 font-bold">{dashboardStats.totalRestaurants} partner restaurants</span>,{' '}
              <span className="text-amber-400 font-bold">{totalFoodItemsCount} menu dishes</span>, and{' '}
              <span className="text-emerald-400 font-bold">{dashboardStats.activeOrders} active orders</span> currently on the road.
            </p>
          </div>

          {/* Banner Quick Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddRestaurantModalOpen(true)}
              className="px-5 py-3 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Add Restaurant</span>
            </button>
            <Link
              to="/menu"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white hover:border-neutral-700 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Core Dashboard Metric Stat Cards */}
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Total Restaurants */}
          <Link to="/restaurants" className="block transition-transform hover:-translate-y-0.5">
            <StatCard
              title="Total Restaurants"
              value={dashboardStats.totalRestaurants}
              change="+4 New"
              isPositive={true}
              icon={UtensilsCrossed}
              colorScheme="orange"
              subtitle="Verified food partners"
              sparklineType="bars"
            />
          </Link>

          {/* 2. Total Food Items -> Links to /menu */}
          <Link to="/menu" className="block transition-transform hover:-translate-y-0.5">
            <StatCard
              title="Total Food Items"
              value={totalFoodItemsCount}
              change="+12 Dishes"
              isPositive={true}
              icon={Pizza}
              colorScheme="amber"
              subtitle="Explore catalog dishes"
              sparklineType="bars"
            />
          </Link>

          {/* 3. Total Orders -> Links to /orders */}
          <Link to="/orders" className="block transition-transform hover:-translate-y-0.5">
            <StatCard
              title="Total Orders"
              value={dashboardStats.totalOrders}
              change="+24% vs Last Wk"
              isPositive={true}
              icon={ShoppingBag}
              colorScheme="cyan"
              subtitle="Lifetime placed orders"
              sparklineType="wave"
            />
          </Link>

          {/* 4. Active Orders -> Links to /orders */}
          <Link to="/orders" className="block transition-transform hover:-translate-y-0.5">
            <StatCard
              title="Active Orders"
              value={dashboardStats.activeOrders}
              change="Live Prep"
              isPositive={true}
              icon={Clock}
              colorScheme="emerald"
              subtitle="In kitchen & on route"
              sparklineType="bars"
            />
          </Link>

          {/* 5. Delivered Orders -> Links to /orders */}
          <Link to="/orders" className="block transition-transform hover:-translate-y-0.5">
            <StatCard
              title="Delivered Orders"
              value={dashboardStats.deliveredOrders}
              change="99.2% Rate"
              isPositive={true}
              icon={CheckCircle2}
              colorScheme="rose"
              subtitle="Fulfilled on time"
              sparklineType="wave"
            />
          </Link>

          {/* 6. Total Customers */}
          <StatCard
            title="Total Customers"
            value={dashboardStats.totalCustomers}
            change="+18 Active"
            isPositive={true}
            icon={Users}
            colorScheme="purple"
            subtitle="Repeat diners"
            sparklineType="bars"
          />
        </div>
      )}

      {/* Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Quick Management Actions</span>
          </h2>
          <span className="text-xs text-slate-400">1-Click Shortcuts</span>
        </div>
        <QuickActions onOpenAddRestaurant={() => setIsAddRestaurantModalOpen(true)} />
      </div>

      {/* Middle Section: Revenue Chart & Top Cuisines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart totalRevenue={dashboardStats.totalRevenue} />
        </div>
        <div>
          <TopCuisines restaurants={restaurants} />
        </div>
      </div>

      {/* Bottom Section: Recent Orders Feed */}
      <RecentOrders orders={dashboardStats.recentOrders} />
    </div>
  );
};
