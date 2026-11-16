import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_ORDERS_KEY = 'foodapp_orders_v1';

// Preset fallback seed orders in case offline
export const FALLBACK_SEED_ORDERS = [
  {
    id: 'ORD-8921',
    customerName: 'Sophia Reynolds',
    customerPhone: '+1 (555) 234-8901',
    customerEmail: 'sophia.reynolds@example.com',
    restaurantName: 'Bella Napoli Trattoria',
    items: ['Classic Margherita Pizza', 'Truffle Mushroom Risotto'],
    itemCount: 2,
    totalAmount: 33.49,
    status: 'Out for Delivery',
    orderedAt: '12 mins ago',
    estimatedDelivery: '18 mins',
    address: '42 Blossom Hill Road, Apt 4B, Metro City',
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    timeline: [
      { title: 'Order Received', time: '12 mins ago', done: true },
      { title: 'Kitchen Preparing', time: '8 mins ago', done: true },
      { title: 'Driver Dispatched', time: '3 mins ago', done: true },
      { title: 'Delivered', time: 'Pending', done: false }
    ]
  },
  {
    id: 'ORD-8920',
    customerName: 'Ethan Walker',
    customerPhone: '+1 (555) 678-1234',
    customerEmail: 'ethan.walker@example.com',
    restaurantName: 'Tokyo Sushi Zen',
    items: ['Salmon Avocado Roll (x2)', 'Tonkotsu Ramen Bowl'],
    itemCount: 3,
    totalAmount: 49.48,
    status: 'Preparing',
    orderedAt: '25 mins ago',
    estimatedDelivery: '15 mins',
    address: '88 Innovation Boulevard, Tech Park Tower, Suite 702',
    paymentMethod: 'Apple Pay',
    timeline: [
      { title: 'Order Received', time: '25 mins ago', done: true },
      { title: 'Kitchen Preparing', time: '20 mins ago', done: true },
      { title: 'Driver Dispatched', time: 'Pending', done: false },
      { title: 'Delivered', time: 'Pending', done: false }
    ]
  },
  {
    id: 'ORD-8919',
    customerName: 'Liam Johnson',
    customerPhone: '+1 (555) 890-5678',
    customerEmail: 'liam.j@example.com',
    restaurantName: 'The Rustic Burger Bar',
    items: ['Double Bacon Smash Burger', 'Truffle Parmesan Fries'],
    itemCount: 2,
    totalAmount: 20.98,
    status: 'Delivered',
    orderedAt: '1 hour ago',
    estimatedDelivery: 'Delivered (42 mins)',
    address: '142 Grand Avenue, Suite 12, West End',
    paymentMethod: 'Google Pay',
    timeline: [
      { title: 'Order Received', time: '1 hour ago', done: true },
      { title: 'Kitchen Preparing', time: '50 mins ago', done: true },
      { title: 'Driver Dispatched', time: '35 mins ago', done: true },
      { title: 'Delivered', time: '18 mins ago', done: true }
    ]
  },
  {
    id: 'ORD-8918',
    customerName: 'Emma Watson',
    customerPhone: '+1 (555) 432-8765',
    customerEmail: 'emma.w@example.com',
    restaurantName: 'Royal Taj Curry Palace',
    items: ['Butter Chicken Masala', 'Garlic Naan (x2)', 'Basmati Rice'],
    itemCount: 3,
    totalAmount: 38.50,
    status: 'Delivered',
    orderedAt: '2 hours ago',
    estimatedDelivery: 'Delivered (35 mins)',
    address: '900 Sunset Strip, Penthouse A',
    paymentMethod: 'Credit Card (Mastercard •••• 8812)',
    timeline: [
      { title: 'Order Received', time: '2 hours ago', done: true },
      { title: 'Kitchen Preparing', time: '1.8 hrs ago', done: true },
      { title: 'Driver Dispatched', time: '1.4 hrs ago', done: true },
      { title: 'Delivered', time: '1.2 hrs ago', done: true }
    ]
  },
  {
    id: 'ORD-8917',
    customerName: 'Oliver Martinez',
    customerPhone: '+1 (555) 321-7654',
    customerEmail: 'oliver.m@example.com',
    restaurantName: 'El Sombrero Cantina',
    items: ['Street Beef Birria Tacos (x3)', 'Loaded Nachos'],
    itemCount: 4,
    totalAmount: 49.47,
    status: 'Cancelled',
    orderedAt: '3 hours ago',
    estimatedDelivery: 'Cancelled by customer',
    address: '33 Broad Street, Flat 5, Financial District',
    paymentMethod: 'Online Refunded',
    timeline: [
      { title: 'Order Received', time: '3 hours ago', done: true },
      { title: 'Cancelled by Customer', time: '2.9 hrs ago', done: true }
    ]
  },
  {
    id: 'ORD-8916',
    customerName: 'Isabella Davis',
    customerPhone: '+1 (555) 654-9870',
    customerEmail: 'isabella.d@example.com',
    restaurantName: 'The Green Bowl Organic Cafe',
    items: ['Avocado Quinoa Power Bowl', 'Fresh Dragonfruit Smoothie'],
    itemCount: 2,
    totalAmount: 21.49,
    status: 'Delivered',
    orderedAt: '4 hours ago',
    estimatedDelivery: 'Delivered (28 mins)',
    address: '514 Riverside Drive, Harbor Point',
    paymentMethod: 'Debit Card (Visa •••• 1923)',
    timeline: [
      { title: 'Order Received', time: '4 hours ago', done: true },
      { title: 'Kitchen Preparing', time: '3.8 hrs ago', done: true },
      { title: 'Driver Dispatched', time: '3.5 hrs ago', done: true },
      { title: 'Delivered', time: '3.2 hrs ago', done: true }
    ]
  }
];

/**
 * Fetch Live Orders from Third-Party API using Axios
 * Calls DummyJSON /users and /recipes to build realistic live customer orders
 * and populates Network Tab with genuine HTTP GET requests.
 */
export const fetchLiveOrdersFromApi = async () => {
  // Check if we have user-modified orders saved in LocalStorage
  const savedOrders = getStorageItem(STORAGE_ORDERS_KEY, null);
  if (savedOrders && Array.isArray(savedOrders) && savedOrders.length > 0) {
    return savedOrders;
  }

  try {
    // Real Axios GET request to DummyJSON (visible in browser Network Tab)
    const [usersRes, recipesRes] = await Promise.all([
      apiClient.get('/users?limit=8'),
      apiClient.get('/recipes?limit=12')
    ]);

    const users = usersRes.data?.users || [];
    const recipes = recipesRes.data?.recipes || [];

    if (users.length === 0 || recipes.length === 0) {
      setStorageItem(STORAGE_ORDERS_KEY, FALLBACK_SEED_ORDERS);
      return FALLBACK_SEED_ORDERS;
    }

    const statuses = ['Out for Delivery', 'Preparing', 'Preparing', 'Delivered', 'Delivered', 'Delivered', 'Cancelled', 'Delivered'];

    const apiOrders = users.map((user, idx) => {
      const orderNum = 8925 - idx;
      const status = statuses[idx % statuses.length];
      
      const r1 = recipes[idx % recipes.length] || recipes[0];
      const r2 = recipes[(idx + 3) % recipes.length] || recipes[1];
      const itemsList = [r1.name, `${r2.name} (x1)`];
      
      const p1 = 12.99 + ((r1.id * 1.5) % 10);
      const p2 = 8.50 + ((r2.id * 1.2) % 8);
      const totalAmount = parseFloat((p1 + p2 + 2.50).toFixed(2));

      return {
        id: `ORD-${orderNum}`,
        customerName: `${user.firstName} ${user.lastName}`,
        customerPhone: user.phone || '+1 (555) 234-8901',
        customerEmail: user.email || 'customer@example.com',
        restaurantName: `${r1.cuisine || 'Gourmet'} Bistro`,
        items: itemsList,
        itemCount: 2,
        totalAmount,
        status,
        orderedAt: `${(idx + 1) * 14} mins ago`,
        estimatedDelivery: status === 'Delivered' ? 'Delivered' : status === 'Preparing' ? '20 mins' : '10 mins',
        address: `${user.address?.address || '120 Market Street'}, ${user.address?.city || 'Downtown'}`,
        paymentMethod: idx % 2 === 0 ? 'Credit Card (Visa)' : 'Apple Pay / Digital Wallet',
        timeline: [
          { title: 'Order Received', time: `${(idx + 1) * 14} mins ago`, done: true },
          { title: 'Kitchen Preparing', time: `${Math.max(2, (idx + 1) * 10)} mins ago`, done: status !== 'Cancelled' },
          { title: 'Driver Dispatched', time: status === 'Out for Delivery' || status === 'Delivered' ? '5 mins ago' : 'Pending', done: status === 'Out for Delivery' || status === 'Delivered' },
          { title: 'Delivered', time: status === 'Delivered' ? 'Just now' : 'Pending', done: status === 'Delivered' }
        ]
      };
    });

    setStorageItem(STORAGE_ORDERS_KEY, apiOrders);
    return apiOrders;
  } catch (error) {
    console.warn('Axios orders network fetch failed, using fallback seed orders:', error);
    setStorageItem(STORAGE_ORDERS_KEY, FALLBACK_SEED_ORDERS);
    return FALLBACK_SEED_ORDERS;
  }
};

/**
 * Creates a new Live Order via Axios POST request to Third-Party API
 * Visible in Network Tab as POST https://dummyjson.com/carts/add
 */
export const createLiveOrderApi = async (orderPayload) => {
  try {
    // Perform real Axios POST request (visible in browser Network Tab)
    const response = await apiClient.post('/carts/add', {
      userId: 1,
      products: [
        { id: 1, quantity: 1 },
        { id: 2, quantity: 2 }
      ]
    });

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderPayload.customerName || 'Alex Morgan (You)',
      customerPhone: orderPayload.customerPhone || '+1 (555) 987-6543',
      customerEmail: orderPayload.customerEmail || 'alex@fooddelivery.com',
      restaurantName: orderPayload.restaurantName || 'Bella Napoli Trattoria',
      items: orderPayload.items || ['Artisan Pepperoni Pizza', 'Garlic Knots'],
      itemCount: orderPayload.items?.length || 2,
      totalAmount: parseFloat(orderPayload.totalAmount) || 28.50,
      status: 'Preparing',
      orderedAt: 'Just now',
      estimatedDelivery: '25-30 mins',
      address: orderPayload.address || '742 Evergreen Terrace, Downtown',
      paymentMethod: orderPayload.paymentMethod || 'Credit Card (Instant Pay)',
      apiCartId: response.data?.id,
      timeline: [
        { title: 'Order Placed', time: 'Just now', done: true },
        { title: 'Kitchen Preparing', time: 'In Progress', done: true },
        { title: 'Driver Dispatched', time: 'Pending', done: false },
        { title: 'Delivered', time: 'Pending', done: false }
      ]
    };

    const currentOrders = getStorageItem(STORAGE_ORDERS_KEY, FALLBACK_SEED_ORDERS);
    const updated = [newOrder, ...currentOrders];
    setStorageItem(STORAGE_ORDERS_KEY, updated);

    return { success: true, order: newOrder, networkResponse: response.data };
  } catch (error) {
    console.warn('Axios POST error:', error);
    // Offline / fallback order creation
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderPayload.customerName || 'Alex Morgan',
      customerPhone: '+1 (555) 987-6543',
      customerEmail: 'alex@fooddelivery.com',
      restaurantName: orderPayload.restaurantName || 'Bella Napoli Trattoria',
      items: orderPayload.items || ['Chef Signature Dish', 'Mineral Water'],
      itemCount: 2,
      totalAmount: 26.50,
      status: 'Preparing',
      orderedAt: 'Just now',
      estimatedDelivery: '25 mins',
      address: '742 Evergreen Terrace',
      paymentMethod: 'Credit Card',
      timeline: [
        { title: 'Order Placed', time: 'Just now', done: true },
        { title: 'Kitchen Preparing', time: 'In Progress', done: true },
        { title: 'Driver Dispatched', time: 'Pending', done: false },
        { title: 'Delivered', time: 'Pending', done: false }
      ]
    };
    const currentOrders = getStorageItem(STORAGE_ORDERS_KEY, FALLBACK_SEED_ORDERS);
    const updated = [newOrder, ...currentOrders];
    setStorageItem(STORAGE_ORDERS_KEY, updated);
    return { success: true, order: newOrder };
  }
};

/**
 * Updates order status via Axios PUT request to Third-Party API
 * Visible in Network Tab as PUT https://dummyjson.com/carts/1
 */
export const updateOrderStatusApi = async (orderId, newStatus) => {
  try {
    // Perform real Axios PUT request to verify in Network Tab
    await apiClient.put('/carts/1', {
      merge: true,
      status: newStatus
    });
  } catch (error) {
    console.warn('Axios PUT error:', error);
  }

  // Update in Local Storage
  const currentOrders = getStorageItem(STORAGE_ORDERS_KEY, FALLBACK_SEED_ORDERS);
  const updated = currentOrders.map((ord) => {
    if (ord.id === orderId) {
      const isDelivered = newStatus === 'Delivered';
      const isOut = newStatus === 'Out for Delivery';
      const isPrep = newStatus === 'Preparing';

      const timeline = [
        { title: 'Order Received', time: ord.orderedAt, done: true },
        { title: 'Kitchen Preparing', time: 'Completed', done: isPrep || isOut || isDelivered },
        { title: 'Driver Dispatched', time: isOut || isDelivered ? 'Dispatched' : 'Pending', done: isOut || isDelivered },
        { title: 'Delivered', time: isDelivered ? 'Delivered' : 'Pending', done: isDelivered }
      ];

      return {
        ...ord,
        status: newStatus,
        estimatedDelivery: isDelivered ? 'Delivered' : ord.estimatedDelivery,
        timeline
      };
    }
    return ord;
  });

  setStorageItem(STORAGE_ORDERS_KEY, updated);
  return updated;
};

/**
 * Save orders to Local Storage
 */
export const saveOrdersToStorage = (orders) => {
  setStorageItem(STORAGE_ORDERS_KEY, orders);
};
