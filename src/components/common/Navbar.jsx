import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  LogOut, 
  Menu,
  User,
  ShoppingBag,
  ShoppingCart,
  Flame,
  CheckCircle2,
  Receipt,
  UtensilsCrossed
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { BrandLogo } from './BrandLogo';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useRestaurants();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('You have safely signed out.');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!location.pathname.includes('/restaurants')) {
      navigate('/restaurants');
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Order ORD-8921 is Out for Delivery',
      desc: 'Driver Marcus is en route to 42 Blossom Hill Road.',
      time: '5 mins ago',
      unread: true
    },
    {
      id: 2,
      title: 'Fresh Menu Item Added',
      desc: 'Bella Napoli added Truffle Mushroom Risotto to their catalog.',
      time: '35 mins ago',
      unread: true
    },
    {
      id: 3,
      title: 'Daily Revenue Target Reached',
      desc: 'Platform processed over $14,000 in gross orders today!',
      time: '2 hours ago',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#18181b]/95 backdrop-blur-xl border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Hamburger & Brand Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <BrandLogo showSubtitle={false} />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines, pizzas, sushi..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Link to Restaurants */}
        <Link
          to="/restaurants"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-bold transition-colors"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Browse Restaurants</span>
        </Link>

        {/* Cart Link with Live Badge */}
        <Link
          to="/cart"
          className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white hover:border-orange-500/40 transition-colors flex items-center justify-center"
          title="View Shopping Cart"
          aria-label="View Shopping Cart"
        >
          <ShoppingCart className="w-4 h-4 text-orange-400" />
          {totalItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.6)] animate-pulse">
              {totalItemCount}
            </span>
          )}
        </Link>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white hover:border-neutral-700 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-[#18181b]" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#18181b] border border-neutral-800 shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                  2 New
                </span>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      n.unread
                        ? 'bg-orange-500/10 border border-orange-500/20'
                        : 'bg-neutral-900/50 border border-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden xl:block text-left pr-2">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-orange-400 leading-tight">
                {user?.role || 'Manager'}
              </p>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#18181b] border border-neutral-800 shadow-2xl p-3 z-50 animate-fade-in">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 mb-2">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authenticated Session</span>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-orange-400" />
                  <span>View Customer Profile</span>
                </Link>

                <Link
                  to="/order-history"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Past Orders & Invoices</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>Order Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
