// Formatting and display utility functions

export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(num);
};

export const formatDeliveryFee = (fee) => {
  if (fee === 0 || fee === '0' || fee === 'Free' || fee === 'FREE') {
    return 'Free Delivery';
  }
  const num = typeof fee === 'number' ? fee : parseFloat(fee) || 0;
  return `${formatCurrency(num)} Delivery`;
};

export const getOrderStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        dot: 'bg-emerald-400'
      };
    case 'out for delivery':
    case 'on the way':
      return {
        bg: 'bg-cyan-500/15',
        text: 'text-cyan-400',
        border: 'border-cyan-500/40',
        dot: 'bg-cyan-400 animate-pulse'
      };
    case 'preparing':
    case 'processing':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        dot: 'bg-amber-400 animate-ping'
      };
    case 'cancelled':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        dot: 'bg-rose-400'
      };
    default:
      return {
        bg: 'bg-slate-700/30',
        text: 'text-slate-300',
        border: 'border-slate-700',
        dot: 'bg-slate-400'
      };
  }
};
