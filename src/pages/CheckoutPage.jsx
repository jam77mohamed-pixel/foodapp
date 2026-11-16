import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  AlertCircle, 
  Truck, 
  ShoppingBag,
  Sparkles,
  Phone,
  User,
  Building,
  Tag,
  X,
  QrCode,
  Wallet,
  Smartphone,
  Lock,
  Landmark
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRestaurants } from '../context/RestaurantContext';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';

export const CheckoutPage = () => {
  const { 
    cartItems, 
    subtotal, 
    deliveryFee, 
    tax, 
    discountAmount, 
    totalPrice, 
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons
  } = useCart();
  const { user } = useAuth();
  const { createLiveOrder } = useRestaurants();
  const navigate = useNavigate();

  // Delivery Address State prefilled from primary saved address
  const defaultSaved = user?.savedAddresses?.find(a => a.isDefault) || user?.savedAddresses?.[0];

  const [formData, setFormData] = useState({
    fullName: defaultSaved?.recipientName || user?.name || 'Alex Morgan',
    phone: defaultSaved?.phone || user?.phone || '+1 (555) 234-8901',
    address: defaultSaved?.address || '42 Blossom Hill Road',
    apartment: 'Apt 4B',
    city: defaultSaved?.city || 'Metro City',
    instructions: 'Please ring bell and leave by the front door'
  });

  // Payment Method Selection: 'card' | 'upi' | 'wallet' | 'netbanking'
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Interactive Card Form State
  const [cardData, setCardData] = useState({
    number: '4242 5812 9012 4242',
    name: user?.name || 'Alex Morgan',
    expiry: '09/28',
    cvv: '884',
    saveCard: true
  });

  // Interactive UPI Form State
  const [upiId, setUpiId] = useState('alex.morgan@okaxis');
  const [isUpiVerified, setIsUpiVerified] = useState(true);

  // Digital Wallet Selection
  const [selectedWallet, setSelectedWallet] = useState('craveflow'); // 'craveflow' | 'apple' | 'paypal'

  // Selected Bank for Net Banking
  const [selectedBank, setSelectedBank] = useState('chase');

  // Simulation Mode for testing both success and failure flows
  const [simulationMode, setSimulationMode] = useState('success'); // 'success' | 'failure'

  // Coupon input inside checkout
  const [couponInput, setCouponInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // PREVENT EMPTY CART CHECKOUT
  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-[#18181b]/60 border border-neutral-800 p-6 space-y-4 max-w-lg mx-auto my-10">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          You cannot proceed to checkout with an empty cart. Please choose your favorite dishes first!
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-gradient-glow text-white text-xs font-black shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Menu Catalog</span>
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phone.trim()) errs.phone = 'Mobile number is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';

    if (paymentMethod === 'card') {
      if (!cardData.number || cardData.number.replace(/\s/g, '').length < 15) {
        errs.cardNumber = 'Valid 16-digit card number required';
      }
      if (!cardData.expiry || !cardData.expiry.includes('/')) {
        errs.cardExpiry = 'Valid MM/YY expiry required';
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        errs.cardCvv = '3-digit CVV required';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        errs.upiId = 'Valid UPI ID required (e.g. name@bank)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    if (ok) setCouponInput('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please complete all required delivery and payment details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const primaryRestaurant = cartItems[0]?.restaurantName || 'Gourmet Kitchen';
      const itemsList = cartItems.map(i => `${i.name} (x${i.quantity})`);

      // Real Axios POST /carts/add is triggered via createLiveOrder
      const newOrder = await createLiveOrder({
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: user?.email || 'customer@example.com',
        restaurantName: primaryRestaurant,
        items: itemsList,
        itemCount: cartItems.length,
        totalAmount: totalPrice,
        address: `${formData.address}${formData.apartment ? `, ${formData.apartment}` : ''}, ${formData.city}`,
        paymentMethod:
          paymentMethod === 'card'
            ? `Credit Card (Visa •••• ${cardData.number.slice(-4) || '4242'})`
            : paymentMethod === 'upi'
            ? `Instant UPI (${upiId})`
            : paymentMethod === 'wallet'
            ? `CraveFlow Digital Wallet`
            : `Net Banking (${selectedBank.toUpperCase()})`
      });

      // Check if user selected failure simulation
      if (simulationMode === 'failure') {
        // Do NOT clear cart so user can retry!
        navigate(
          `/payment-failure?orderId=${newOrder.id}&amount=${totalPrice}&method=${paymentMethod}&reason=insufficient_funds`
        );
        return;
      }

      // Normal Success Flow
      clearCart();
      navigate(`/payment-success/${newOrder.id}`, { 
        state: { 
          order: newOrder,
          paymentMethod: paymentMethod === 'card' 
            ? `Visa ending in ${cardData.number.slice(-4) || '4242'}`
            : paymentMethod === 'upi' ? `Instant UPI (${upiId})` : 'CraveFlow Wallet Balance',
          txnId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
        } 
      });
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error('Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format Card Number helper
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData({ ...cardData, number: formatted });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Return to Food Cart</span>
        </Link>

        <span className="text-xs text-slate-400 font-medium">
          Step 2 of 3: Secure Delivery & Payment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Delivery Address & Payment Method (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Delivery Address */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">1. Delivery Address</h3>
                <p className="text-xs text-slate-400">Where should our courier deliver your feast?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Recipient Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Contact Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 (555) 234-8901"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Street Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 42 Blossom Hill Road"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                  />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Apartment / Suite / Floor
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="e.g. Apt 4B, 2nd Floor"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Metro City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Courier Delivery Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="e.g. Ring bell, gate access #1234, leave by front porch..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Payment Gateway */}
          <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">2. Payment Method</h3>
                  <p className="text-xs text-slate-400">Select your preferred transaction gateway</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Lock className="w-3 h-3" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-neutral-900 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)] text-white'
                    : 'bg-neutral-900/50 border-neutral-800 text-slate-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span className="text-xs font-bold block">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'bg-neutral-900 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)] text-white'
                    : 'bg-neutral-900/50 border-neutral-800 text-slate-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold block">Instant UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'wallet'
                    ? 'bg-neutral-900 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)] text-white'
                    : 'bg-neutral-900/50 border-neutral-800 text-slate-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Wallet className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold block">Crave Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'bg-neutral-900 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)] text-white'
                    : 'bg-neutral-900/50 border-neutral-800 text-slate-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Landmark className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-bold block">Net Banking</span>
              </button>
            </div>

            {/* PAYMENT TAB 1: Credit / Debit Card Interactive Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-6 pt-2">
                {/* 3D Glassmorphic Card Preview */}
                <div className="relative h-48 sm:h-52 w-full max-w-sm mx-auto rounded-3xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white border border-neutral-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Top row: Chip & Brand */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-600 shadow-inner flex items-center justify-center">
                      <div className="w-7 h-5 border border-amber-800/40 rounded-sm" />
                    </div>
                    <span className="text-sm font-black tracking-widest text-orange-400 uppercase">
                      VISA PLATINUM
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="py-2">
                    <p className="text-lg sm:text-xl font-mono tracking-widest font-black drop-shadow-md">
                      {cardData.number || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  {/* Bottom row: Holder & Expiry */}
                  <div className="flex items-end justify-between text-xs">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
                      <p className="font-bold tracking-wide uppercase truncate max-w-[170px]">
                        {cardData.name || 'ALEX MORGAN'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Expires</p>
                      <p className="font-mono font-bold tracking-wider">
                        {cardData.expiry || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      16-Digit Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={handleCardNumberChange}
                      placeholder="4242 5812 9012 4242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-mono text-white outline-none focus:border-orange-500"
                    />
                    {errors.cardNumber && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-mono text-white outline-none focus:border-orange-500"
                      />
                      {errors.cardExpiry && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.cardExpiry}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.slice(0, 4) })}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-mono text-white outline-none focus:border-orange-500"
                      />
                      {errors.cardCvv && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.cardCvv}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveCardCheck"
                      checked={cardData.saveCard}
                      onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
                      className="w-4 h-4 rounded-md accent-orange-500 cursor-pointer"
                    />
                    <label htmlFor="saveCardCheck" className="text-xs text-slate-300 cursor-pointer">
                      Save card securely for future fast 1-click orders
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT TAB 2: Instant UPI */}
            {paymentMethod === 'upi' && (
              <div className="space-y-5 pt-2">
                <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row items-center gap-5">
                  <div className="p-3 rounded-2xl bg-white text-black shrink-0 shadow-lg text-center">
                    <QrCode className="w-24 h-24 mx-auto text-black" />
                    <span className="text-[10px] font-black uppercase tracking-wider block mt-1 text-slate-800">
                      Scan & Pay
                    </span>
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="text-sm font-black text-white">Scan with any UPI App</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Scan this verified QR code with Google Pay, PhonePe, Paytm, or BHIM for instant confirmation.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <span key={app} className="px-2.5 py-1 rounded-lg bg-neutral-800 text-[10px] font-bold text-slate-300">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Or Enter Your UPI ID / VPA
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setIsUpiVerified(false);
                      }}
                      placeholder="e.g. mobile@upi or username@okaxis"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (upiId.includes('@')) {
                          setIsUpiVerified(true);
                          toast.success('UPI ID verified! Ready to pay.');
                        } else {
                          toast.error('Invalid UPI format. Must contain @');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      {isUpiVerified ? 'Verified ✓' : 'Verify'}
                    </button>
                  </div>
                  {errors.upiId && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.upiId}</p>
                  )}
                </div>
              </div>
            )}

            {/* PAYMENT TAB 3: CraveFlow Digital Wallet */}
            {paymentMethod === 'wallet' && (
              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-neutral-900 to-neutral-900 border border-orange-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">CraveFlow Digital Balance</h4>
                        <p className="text-xs text-slate-400">Instant 1-click settlement</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-emerald-400">$150.00</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Your wallet balance is sufficient to cover this entire order of {formatCurrency(totalPrice)}.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWallet('craveflow')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedWallet === 'craveflow'
                        ? 'bg-neutral-900 border-orange-500 text-white'
                        : 'bg-neutral-900/40 border-neutral-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">CraveFlow Wallet</span>
                    <span className="text-[10px] text-emerald-400 block">$150.00 Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWallet('apple')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedWallet === 'apple'
                        ? 'bg-neutral-900 border-orange-500 text-white'
                        : 'bg-neutral-900/40 border-neutral-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">Apple Pay</span>
                    <span className="text-[10px] text-slate-400 block">Touch ID / Face ID</span>
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT TAB 4: Net Banking */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Choose Your Bank Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'chase', name: 'Chase Bank' },
                    { id: 'bofa', name: 'Bank of America' },
                    { id: 'wells', name: 'Wells Fargo' },
                    { id: 'citi', name: 'Citibank' }
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedBank === bank.id
                          ? 'bg-neutral-900 border-orange-500 text-white font-bold'
                          : 'bg-neutral-900/40 border-neutral-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs block">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Simulation Testing Switch for Failure Mode */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                Payment Processing Simulation:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSimulationMode('success')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    simulationMode === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Success Flow
                </button>
                <button
                  type="button"
                  onClick={() => setSimulationMode('failure')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    simulationMode === 'failure'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Simulate card declined to demonstrate retry handling"
                >
                  Test Failure Flow
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary: Items & Place Order Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-6 space-y-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span>Order Summary ({cartItems.length})</span>
              </h3>
              <span className="text-xs text-orange-400 font-bold">
                {cartItems[0]?.restaurantName || 'Partner Kitchen'}
              </span>
            </div>

            {/* Estimated Delivery Time Strip */}
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-300">Estimated Arrival:</span>
              </div>
              <span className="text-xs font-black text-white bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                25 - 35 mins
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-850">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-neutral-800 text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="text-white truncate font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Coupon in Checkout */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  <span>Promo Coupon</span>
                </span>
                {appliedCoupon && (
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">
                    Applied
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-white">{appliedCoupon.code}</span>
                    <p className="text-[10px] text-emerald-300">{appliedCoupon.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 rounded-lg hover:bg-neutral-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. CRAVE20"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs uppercase font-bold text-white outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl btn-gradient-glow text-white text-xs font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        className="px-2 py-0.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-[10px] font-bold text-orange-400 border border-neutral-700/60 cursor-pointer transition-colors"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-800 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-400">FREE</span>
                ) : (
                  <span className="font-bold text-white">{formatCurrency(deliveryFee)}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Taxes & Service (8%)</span>
                <span className="font-bold text-white">{formatCurrency(tax)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Promo Savings</span>
                  <span className="font-black">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-3 border-t border-neutral-800 text-white">
                <div>
                  <span className="text-sm font-black">Amount to Authorize</span>
                  <p className="text-[10px] text-slate-400">All taxes included</p>
                </div>
                <span className="text-2xl font-black text-orange-400">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-2xl btn-gradient-glow text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Authorize & Place Order • {formatCurrency(totalPrice)}</span>
                </>
              )}
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Secure & Contactless Feasts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
