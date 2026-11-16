import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { updateUserProfileApi } from '../api/userApi';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'foodapp_current_user_v1';
const USERS_STORAGE_KEY = 'foodapp_all_users_v1';

// Pre-seeded demo user for immediate 1-click access
const DEMO_USERS = [
  {
    id: 'user-foodie-1',
    name: 'Alex Morgan',
    email: 'alex@fooddelivery.com',
    password: 'password123',
    role: 'Restaurant Manager',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Culinary connoisseur & fast-casual dining enthusiast across downtown.',
    joinedDate: 'Jan 2024',
    savedAddresses: [
      { 
        id: 'addr-1', 
        label: 'Home', 
        recipientName: 'Alex Morgan',
        address: '42 Blossom Hill Road, Apt 4B',
        city: 'Downtown Metro',
        zipCode: '10001',
        phone: '+1 (555) 345-6789',
        isDefault: true 
      },
      { 
        id: 'addr-2', 
        label: 'Office', 
        recipientName: 'Alex Morgan',
        address: '88 Innovation Boulevard, Tech Park Tower 2',
        city: 'Silicon Hills',
        zipCode: '94016',
        phone: '+1 (555) 345-6789',
        isDefault: false 
      }
    ]
  },
  {
    id: 'user-foodie-2',
    name: 'David Chen',
    email: 'david@craveflow.com',
    password: 'password123',
    role: 'Food Delivery Partner',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Passionate about quick-service street food and gourmet tacos.',
    joinedDate: 'Mar 2024',
    savedAddresses: [
      { 
        id: 'addr-3', 
        label: 'Home', 
        recipientName: 'David Chen',
        address: '77 Lakeside Terrace, Waterfront District',
        city: 'Harbor Bay',
        zipCode: '94107',
        phone: '+1 (555) 789-0123',
        isDefault: true 
      }
    ]
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = getStorageItem(AUTH_STORAGE_KEY, null);
    return saved || DEMO_USERS[0];
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = getStorageItem(USERS_STORAGE_KEY, null);
    return saved && saved.length > 0 ? saved : DEMO_USERS;
  });

  // Sync current user to localStorage
  useEffect(() => {
    if (user) {
      setStorageItem(AUTH_STORAGE_KEY, user);
    } else {
      removeStorageItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Sync registered users list to localStorage
  useEffect(() => {
    setStorageItem(USERS_STORAGE_KEY, registeredUsers);
  }, [registeredUsers]);

  // Login handler
  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    let found = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    // Fallback check against default demo user
    if (!found && cleanEmail === DEMO_USERS[0].email) {
      found = DEMO_USERS[0];
    }

    if (!found) {
      throw new Error('No account found with this email. Please check your credentials or register.');
    }

    if (found.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    setUser(found);
    return found;
  };

  // Register handler
  const register = ({ name, email, password, phone = '', role = 'Food Delivery Member' }) => {
    const cleanEmail = email.toLowerCase().trim();
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: cleanEmail,
      password,
      role: role || 'Food Delivery Member',
      phone: phone || '+1 (555) 000-0000',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: 'Excited foodie ready to discover top-rated local dining spots.',
      joinedDate: 'Today',
      savedAddresses: [
        { 
          id: `addr-${Date.now()}`, 
          label: 'Home', 
          recipientName: name,
          address: '124 Maple Street, Apt 10', 
          city: 'Metro City',
          zipCode: '10001',
          phone: phone || '+1 (555) 000-0000',
          isDefault: true 
        }
      ]
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    setUser(newUser);
    return newUser;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  // Reset password simulation
  const resetPassword = (email, newPassword) => {
    const cleanEmail = email.toLowerCase().trim();
    const userIndex = registeredUsers.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (userIndex === -1 && cleanEmail !== DEMO_USERS[0].email) {
      throw new Error('We could not find an account registered with that email address.');
    }

    if (userIndex !== -1) {
      const updated = [...registeredUsers];
      updated[userIndex].password = newPassword;
      setRegisteredUsers(updated);
    }

    if (user && user.email.toLowerCase() === cleanEmail) {
      setUser({ ...user, password: newPassword });
    }

    return true;
  };

  // Update profile details
  const updateProfile = useCallback(async (profileData) => {
    if (!user) return;
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );

    // Trigger Axios PUT in Network tab
    try {
      const nameParts = (profileData.name || user.name).split(' ');
      await updateUserProfileApi(1, {
        firstName: nameParts[0] || 'Alex',
        lastName: nameParts.slice(1).join(' ') || 'Morgan',
        email: profileData.email || user.email,
        phone: profileData.phone || user.phone
      });
    } catch (err) {
      console.warn('Profile network sync note:', err);
    }

    return updatedUser;
  }, [user]);

  // Delivery Address Management: Add Address
  const addAddress = useCallback(async (newAddressData) => {
    if (!user) return;
    const addressId = `addr-${Date.now()}`;
    const isFirst = !user.savedAddresses || user.savedAddresses.length === 0;
    const shouldBeDefault = newAddressData.isDefault || isFirst;

    const newAddress = {
      id: addressId,
      label: newAddressData.label || 'Home',
      recipientName: newAddressData.recipientName || user.name,
      address: newAddressData.address || '',
      city: newAddressData.city || 'Metro City',
      zipCode: newAddressData.zipCode || '10001',
      phone: newAddressData.phone || user.phone || '+1 (555) 345-6789',
      isDefault: shouldBeDefault
    };

    let updatedAddresses = user.savedAddresses ? [...user.savedAddresses] : [];
    if (shouldBeDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const updatedUser = { ...user, savedAddresses: updatedAddresses };
    setUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );

    // Axios PUT call in Network tab
    try {
      await updateUserProfileApi(1, {
        address: {
          address: newAddress.address,
          city: newAddress.city,
          postalCode: newAddress.zipCode
        }
      });
    } catch (err) {
      console.warn('Address network sync note:', err);
    }

    return newAddress;
  }, [user]);

  // Delivery Address Management: Edit Address
  const editAddress = useCallback(async (addressId, updatedData) => {
    if (!user || !user.savedAddresses) return;

    let updatedAddresses = user.savedAddresses.map((addr) => {
      if (addr.id === addressId) {
        return {
          ...addr,
          ...updatedData,
          isDefault: updatedData.isDefault ? true : addr.isDefault
        };
      }
      if (updatedData.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    const updatedUser = { ...user, savedAddresses: updatedAddresses };
    setUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );

    try {
      await updateUserProfileApi(1, {
        address: {
          address: updatedData.address,
          city: updatedData.city,
          postalCode: updatedData.zipCode
        }
      });
    } catch (err) {
      console.warn('Address update network sync note:', err);
    }
  }, [user]);

  // Delivery Address Management: Delete Address
  const deleteAddress = useCallback(async (addressId) => {
    if (!user || !user.savedAddresses) return;

    const remaining = user.savedAddresses.filter((a) => a.id !== addressId);
    // If we deleted the default, set first remaining as default
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }

    const updatedUser = { ...user, savedAddresses: remaining };
    setUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );

    try {
      await updateUserProfileApi(1, { totalAddresses: remaining.length });
    } catch (err) {
      console.warn('Address delete network sync note:', err);
    }
  }, [user]);

  // Delivery Address Management: Set Default Address
  const setDefaultAddress = useCallback(async (addressId) => {
    if (!user || !user.savedAddresses) return;

    const updatedAddresses = user.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));

    const updatedUser = { ...user, savedAddresses: updatedAddresses };
    setUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );

    try {
      await updateUserProfileApi(1, { defaultAddressId: addressId });
    } catch (err) {
      console.warn('Default address sync note:', err);
    }
  }, [user]);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        demoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
