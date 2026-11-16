import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Pizza,
  ShoppingCart,
  Truck
} from 'lucide-react';
import { useRestaurants } from '../../context/RestaurantContext';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';

export const BottomDock = () => {
  const { restaurants } = useRestaurants();
  const { menuStats } = useMenu();
  const { totalItemCount } = useCart();
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: LayoutDashboard
    },
    {
      to: '/restaurants',
      label: 'Dining',
      icon: UtensilsCrossed,
      badge: restaurants?.length ? restaurants.length : null
    },
    {
      to: '/menu',
      label: 'Menu',
      icon: Pizza,
      badge: menuStats?.total ? menuStats.total : null
    },
    {
      to: '/cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge: totalItemCount > 0 ? totalItemCount : null
    },
    {
      to: '/tracking',
      label: 'Tracking',
      icon: Truck
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 py-2 bg-[#18181b]/95 backdrop-blur-xl border-t border-neutral-800 shadow-[0_-5px_25px_rgba(0,0,0,0.6)] flex items-center justify-between sm:justify-center gap-1 sm:gap-6 lg:hidden">
      <div className="flex items-center justify-around w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all duration-200 ${
                isActive
                  ? 'text-orange-400 bg-orange-500/15 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>

              {item.badge && !isActive && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-500 text-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
