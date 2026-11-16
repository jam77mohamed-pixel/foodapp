import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home,
  Building,
  Camera,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  Star,
  Check
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { fetchUserProfileApi } from '../api/userApi';

// Curated avatar choices for foodie profiles
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
];

export const ProfilePage = () => {
  const { 
    user, 
    updateProfile, 
    addAddress, 
    editAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAuth();

  // Network sync indicator state
  const [isSyncing, setIsSyncing] = useState(false);

  // Profile Edit Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || AVATAR_PRESETS[0]
  });

  // Avatar Picker Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Address Modals State
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipientName: user?.name || '',
    address: '',
    city: 'Metro City',
    zipCode: '10001',
    phone: user?.phone || '',
    isDefault: false
  });

  // Trigger real network call on mount (Network Tab: GET /users/1)
  useEffect(() => {
    let isMounted = true;
    const syncProfileWithCloud = async () => {
      setIsSyncing(true);
      try {
        await fetchUserProfileApi(1);
      } catch (err) {
        console.warn('Profile cloud sync:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };
    syncProfileWithCloud();
    return () => {
      isMounted = false;
    };
  }, []);

  // Open profile modal with fresh state
  const handleOpenProfileModal = () => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      avatar: user?.avatar || AVATAR_PRESETS[0]
    });
    setIsProfileModalOpen(true);
  };

  // Save profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!profileForm.email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      await updateProfile(profileForm);
      toast.success('Profile details saved successfully! ✨');
      setIsProfileModalOpen(false);
    } catch {
      toast.error('Unable to update profile. Please try again.');
    }
  };

  // Change avatar handler
  const handleSelectAvatar = async (url) => {
    setProfileForm((prev) => ({ ...prev, avatar: url }));
    await updateProfile({ avatar: url });
    toast.success('Profile picture updated! 📸');
    setIsAvatarModalOpen(false);
  };

  // Add address handler
  const handleOpenAddAddress = () => {
    setAddressForm({
      label: 'Home',
      recipientName: user?.name || 'Alex Morgan',
      address: '',
      city: 'Metro City',
      zipCode: '10001',
      phone: user?.phone || '+1 (555) 345-6789',
      isDefault: (user?.savedAddresses?.length || 0) === 0
    });
    setIsAddAddressModalOpen(true);
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.address.trim()) {
      toast.error('Please enter the street address.');
      return;
    }
    if (!addressForm.city.trim()) {
      toast.error('Please enter the city.');
      return;
    }

    try {
      await addAddress(addressForm);
      toast.success(`Delivery address "${addressForm.label}" saved! 📍`);
      setIsAddAddressModalOpen(false);
    } catch {
      toast.error('Failed to save address.');
    }
  };

  // Edit address handlers
  const handleOpenEditAddress = (addr) => {
    setAddressToEdit(addr);
    setAddressForm({
      label: addr.label || 'Home',
      recipientName: addr.recipientName || user?.name || '',
      address: addr.address || '',
      city: addr.city || 'Metro City',
      zipCode: addr.zipCode || '10001',
      phone: addr.phone || user?.phone || '',
      isDefault: Boolean(addr.isDefault)
    });
    setIsEditAddressModalOpen(true);
  };

  const handleSaveEditAddress = async (e) => {
    e.preventDefault();
    if (!addressToEdit) return;
    if (!addressForm.address.trim()) {
      toast.error('Please enter the street address.');
      return;
    }

    try {
      await editAddress(addressToEdit.id, addressForm);
      toast.success('Address updated successfully!');
      setIsEditAddressModalOpen(false);
      setAddressToEdit(null);
    } catch {
      toast.error('Failed to update address.');
    }
  };

  // Delete address handler
  const handleDeleteAddress = async (addressId, label) => {
    if (user?.savedAddresses?.length <= 1) {
      toast.warn('You must retain at least one delivery address for active orders.');
      return;
    }
    await deleteAddress(addressId);
    toast.info(`Deleted address "${label}".`);
  };

  // Set default address handler
  const handleSetDefaultAddress = async (addressId, label) => {
    await setDefaultAddress(addressId);
    toast.success(`"${label}" is now your primary delivery address! 🏠`);
  };

  const savedAddresses = user?.savedAddresses || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto">
      {/* Top Banner / User Header */}
      <div className="relative rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            {/* User Avatar with change button */}
            <div className="relative shrink-0">
              <img
                src={user?.avatar || AVATAR_PRESETS[0]}
                alt={user?.name}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.35)]"
              />
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors cursor-pointer border border-neutral-900"
                title="Change Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Credentials */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user?.name || 'Alex Morgan'}
                </h1>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span>Gold Foodie Member</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 flex-wrap">
                <span>{user?.email}</span>
                <span>&bull;</span>
                <span>{user?.phone || '+1 (555) 345-6789'}</span>
                <span>&bull;</span>
                <span className="text-slate-400">Joined {user?.joinedDate || 'Jan 2024'}</span>
              </p>

              {user?.bio && (
                <p className="text-xs text-slate-300 italic pt-1 max-w-xl">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={handleOpenProfileModal}
              className="px-4 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Member Quick Stats Strip */}
        <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-white">48</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Orders Placed</p>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-orange-400">{savedAddresses.length}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saved Addresses</p>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-emerald-400">$150.00</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</p>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-lg sm:text-xl font-black text-amber-400">5.0 ★</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Rating</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Personal Details & Saved Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Personal Information Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-white">Personal Information</h3>
              </div>
              <button
                type="button"
                onClick={handleOpenProfileModal}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
              >
                Modify
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Full Name
                </span>
                <p className="text-sm font-bold text-white">{user?.name || 'Alex Morgan'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Registered Email
                </span>
                <p className="text-sm font-bold text-white">{user?.email}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Contact Phone
                </span>
                <p className="text-sm font-bold text-white">{user?.phone || '+1 (555) 345-6789'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Membership Tier
                </span>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-amber-400">VIP Gold Connoisseur</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                    Free Delivery Active
                  </span>
                </div>
              </div>
            </div>

            {/* Cloud Sync Status */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-neutral-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Profile Cloud Sync Active</span>
              </span>
              <span className="text-slate-400">{isSyncing ? 'Refreshing...' : 'Live'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Address Management (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>Saved Delivery Addresses</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage where your culinary orders and groceries are dispatched.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="px-4 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Cards List */}
            <div className="space-y-4">
              {savedAddresses.map((addr) => {
                const isHome = addr.label.toLowerCase().includes('home');
                const isOffice = addr.label.toLowerCase().includes('work') || addr.label.toLowerCase().includes('office');
                const Icon = isHome ? Home : isOffice ? Building : MapPin;

                return (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'bg-neutral-900/90 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/30'
                        : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Left: Tag, Badge, and Full Address */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="w-8 h-8 rounded-xl bg-neutral-800 text-orange-400 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-sm font-black text-white">{addr.label}</span>

                          {addr.isDefault ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Primary Delivery</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id, addr.label)}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
                            >
                              Set as Primary
                            </button>
                          )}
                        </div>

                        <div className="pl-10 space-y-1 text-xs">
                          <p className="font-bold text-slate-200">
                            {addr.recipientName || user?.name}{' '}
                            <span className="text-slate-400 font-normal">
                              ({addr.phone || user?.phone})
                            </span>
                          </p>
                          <p className="text-slate-300 leading-relaxed">
                            {addr.address}
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            {addr.city}, {addr.zipCode}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 pl-10 sm:pl-0 pt-2 sm:pt-0 self-end sm:self-start">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-2 rounded-xl bg-neutral-800 text-slate-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                          title="Edit this address"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id, addr.label)}
                          className="p-2 rounded-xl bg-neutral-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Edit Profile Details */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Personal Information"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Bio / Foodie Notes
            </label>
            <textarea
              rows={2}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Tell us what types of cuisines you enjoy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Change Avatar */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Select Profile Avatar"
        size="md"
      >
        <div className="space-y-5">
          <p className="text-xs text-slate-400">
            Choose an avatar that reflects your culinary personality:
          </p>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {AVATAR_PRESETS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAvatar(url)}
                className={`relative group rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                  user?.avatar === url
                    ? 'border-orange-500 ring-2 ring-orange-500/50 scale-105'
                    : 'border-neutral-800 hover:border-neutral-600'
                }`}
              >
                <img
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                {user?.avatar === url && (
                  <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Or paste custom photo URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customAvatarUrl.trim()) {
                    handleSelectAvatar(customAvatarUrl.trim());
                    setCustomAvatarUrl('');
                  }
                }}
                className="px-4 py-2 rounded-xl btn-gradient-glow text-white text-xs font-bold cursor-pointer"
              >
                Use Photo
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Add Delivery Address */}
      <Modal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        title="Add New Delivery Address"
        size="md"
      >
        <form onSubmit={handleSaveNewAddress} className="space-y-4">
          {/* Label selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Address Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Office', 'Other'].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    addressForm.label === lbl
                      ? 'bg-orange-500/15 text-orange-400 border-orange-500/50 shadow-xs'
                      : 'bg-neutral-900 text-slate-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                value={addressForm.recipientName}
                onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Street Address & Apt / Suite *
            </label>
            <input
              type="text"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              placeholder="e.g. 42 Blossom Hill Road, Apt 4B"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Zip / Postal Code *
              </label>
              <input
                type="text"
                value={addressForm.zipCode}
                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefaultAdd"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-4 h-4 rounded-md accent-orange-500 cursor-pointer"
            />
            <label htmlFor="isDefaultAdd" className="text-xs text-slate-300 cursor-pointer font-medium">
              Set as my primary delivery address
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddAddressModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Location</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: Edit Delivery Address */}
      <Modal
        isOpen={isEditAddressModalOpen}
        onClose={() => setIsEditAddressModalOpen(false)}
        title="Edit Delivery Address"
        size="md"
      >
        <form onSubmit={handleSaveEditAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Address Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Office', 'Other'].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    addressForm.label === lbl
                      ? 'bg-orange-500/15 text-orange-400 border-orange-500/50 shadow-xs'
                      : 'bg-neutral-900 text-slate-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                value={addressForm.recipientName}
                onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Street Address & Apt / Suite *
            </label>
            <input
              type="text"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Zip / Postal Code *
              </label>
              <input
                type="text"
                value={addressForm.zipCode}
                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefaultEdit"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-4 h-4 rounded-md accent-orange-500 cursor-pointer"
            />
            <label htmlFor="isDefaultEdit" className="text-xs text-slate-300 cursor-pointer font-medium">
              Set as my primary delivery address
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsEditAddressModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Update Address</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
