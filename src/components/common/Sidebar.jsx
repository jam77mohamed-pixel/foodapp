import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Pizza,
  ShoppingBag, 
  ShoppingCart,
  Truck,
  Receipt,
  UserCheck, 
  PlusCircle, 
  X,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { BrandLogo } from './BrandLogo';

export const Sidebar = ({ isMobileOpen, onMobileClose, onOpenAddRestaurantModal }) => {
  const { user } = useAuth();
  const { restaurants, dashboardStats } = useRestaurants();
  const { menuStats } = useMenu();
  const { totalItemCount } = useCart();

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/restaurants',
      label: 'Restaurants',
      icon: UtensilsCrossed,
      badge: restaurants?.length ? `${restaurants.length}` : '12+'
    },
    {
      to: '/menu',
      label: 'Menu Catalog',
      icon: Pizza,
      badge: menuStats?.total ? `${menuStats.total}` : '30+'
    },
    {
      to: '/cart',
      label: 'My Cart',
      icon: ShoppingCart,
      badge: totalItemCount > 0 ? `${totalItemCount} Items` : null
    },
    {
      to: '/tracking',
      label: 'Live Tracking',
      icon: Truck,
      badge: 'Live'
    },
    {
      to: '/orders',
      label: 'Live Orders',
      icon: ShoppingBag,
      badge: dashboardStats?.activeOrders ? `${dashboardStats.activeOrders} Active` : '2 Active'
    },
    {
      to: '/order-history',
      label: 'Past Orders',
      icon: Receipt,
      badge: 'Receipts'
    },
    {
      to: '/profile',
      label: 'User Profile',
      icon: UserCheck,
      badge: 'Pro'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#18181b]/95 backdrop-blur-2xl text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-neutral-800 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-800/80">
            <BrandLogo />
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg bg-neutral-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="p-4 space-y-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenAddRestaurantModal) onOpenAddRestaurantModal();
                if (onMobileClose) onMobileClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 btn-gradient-glow text-white text-xs font-black rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Restaurant</span>
            </button>

            <Link
              to="/menu"
              onClick={onMobileClose}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-900/80 hover:bg-neutral-800 text-slate-300 hover:text-white text-[11px] font-bold rounded-xl transition-colors border border-neutral-800 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-orange-400" />
              <span>Explore Food Catalog</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Main Menu</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 font-bold uppercase border border-orange-500/30">
                Portal
              </span>
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-400/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-neutral-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-orange-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-orange-300 border border-neutral-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Snippet */}
        <div className="p-4 border-t border-neutral-800/80">
          <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Alex Morgan'}</p>
                <p className="text-[10px] text-orange-400 truncate font-semibold">
                  {user?.role || 'Restaurant Manager'}
                </p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg text-emerald-400 bg-emerald-950/40 border border-emerald-500/30" title="Active Account">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
