import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '../utils/storage';

const MENU_STORAGE_KEY = 'foodapp_menu_items_v1';

// Preset culinary category image helpers
export const CATEGORY_PRESETS = [
  'All',
  'Pizza',
  'Burgers',
  'Pasta & Italian',
  'Asian & Noodles',
  'Mexican & Tacos',
  'Indian Curries',
  'Healthy & Salads',
  'Desserts & Bakery',
  'Beverages'
];

export const CATEGORY_SAMPLE_IMAGES = {
  Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
  Burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  'Pasta & Italian': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
  'Asian & Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
  'Mexican & Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
  'Indian Curries': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
  'Healthy & Salads': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  'Desserts & Bakery': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  Beverages: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  Default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
};

// Reliable seed food items in case network is disconnected
const FALLBACK_MENU_ITEMS = [
  {
    id: 'food-1',
    name: 'Classic Margherita Pizza',
    category: 'Pizza',
    price: 14.99,
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Bella Napoli Trattoria',
    image: 'https://cdn.dummyjson.com/recipe-images/1.webp',
    description: 'Fresh dough hand-tossed and topped with San Marzano tomato sauce, buffalo mozzarella, fresh sweet basil, and extra virgin olive oil.',
    rating: 4.8,
    reviewCount: 142,
    prepTime: '20 mins',
    calories: '310 kcal',
    ingredients: ['Pizza dough', 'San Marzano tomatoes', 'Fresh buffalo mozzarella', 'Fresh basil', 'Extra virgin olive oil', 'Sea salt'],
    instructions: 'Wood-fired at 480°C for 90 seconds until the crust is blistered and golden brown.'
  },
  {
    id: 'food-2',
    name: 'Double Bacon Smash Burger',
    category: 'Burgers',
    price: 13.50,
    isVeg: false,
    isAvailable: true,
    restaurantName: 'The Rustic Burger Bar',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Two smashed prime Angus beef patties, aged Wisconsin cheddar, crispy smoked bacon, house pickles, and secret relish sauce on toasted brioche.',
    rating: 4.9,
    reviewCount: 220,
    prepTime: '15 mins',
    calories: '680 kcal',
    ingredients: ['Angus beef patties', 'Aged cheddar', 'Applewood smoked bacon', 'Brioche bun', 'House burger sauce', 'Pickles'],
    instructions: 'Seared on a smoking hot flat top griddle for maximum caramelized crust.'
  },
  {
    id: 'food-3',
    name: 'Tonkotsu Chashu Ramen',
    category: 'Asian & Noodles',
    price: 16.99,
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Tokyo Sushi Zen',
    image: 'https://cdn.dummyjson.com/recipe-images/10.webp',
    description: 'Rich 18-hour pork bone broth served with springy artisanal ramen noodles, tender braised pork belly chashu, soft-boiled ajitsuke egg, and nori seaweed.',
    rating: 4.9,
    reviewCount: 310,
    prepTime: '20 mins',
    calories: '550 kcal',
    ingredients: ['Pork bone broth', 'Ramen noodles', 'Braised pork chashu', 'Marinated soft egg', 'Bamboo shoots', 'Scallions', 'Nori'],
    instructions: 'Simmered overnight and assembled fresh to order with hot broth poured over noodles.'
  },
  {
    id: 'food-4',
    name: 'Truffle Cream Fettuccine',
    category: 'Pasta & Italian',
    price: 17.50,
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Bella Napoli Trattoria',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80',
    description: 'Silky handcrafted egg fettuccine tossed in a rich black truffle and Parmigiano-Reggiano cream sauce with sautéed wild forest mushrooms.',
    rating: 4.7,
    reviewCount: 165,
    prepTime: '18 mins',
    calories: '490 kcal',
    ingredients: ['Handmade fettuccine', 'Black truffle carpaccio', 'Parmigiano-Reggiano', 'Heavy cream', 'Wild mushrooms', 'Garlic'],
    instructions: 'Tossed vigorously in a heated saute pan until the sauce emulsifies and clings to the pasta.'
  },
  {
    id: 'food-5',
    name: 'Street Beef Birria Tacos',
    category: 'Mexican & Tacos',
    price: 13.99,
    isVeg: false,
    isAvailable: true,
    restaurantName: 'El Sombrero Cantina',
    image: 'https://cdn.dummyjson.com/recipe-images/4.webp',
    description: 'Three crispy griddled corn tortillas stuffed with slow-braised beef brisket, melted Oaxaca cheese, cilantro, diced onions, served with rich dipping consommé.',
    rating: 4.8,
    reviewCount: 195,
    prepTime: '15 mins',
    calories: '520 kcal',
    ingredients: ['Braised beef brisket', 'Corn tortillas', 'Oaxaca cheese', 'Consommé broth', 'Cilantro', 'Lime wedges'],
    instructions: 'Tortillas are dipped in chili oil, griddled with cheese and beef until crispy, and served with hot consommé.'
  },
  {
    id: 'food-6',
    name: 'Butter Chicken & Garlic Naan',
    category: 'Indian Curries',
    price: 16.50,
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Royal Taj Curry Palace',
    image: 'https://cdn.dummyjson.com/recipe-images/6.webp',
    description: 'Clay-oven charred tandoori chicken tikka pieces simmered in a creamy, velvety tomato, butter, and fenugreek gravy, served with fluffy garlic butter naan.',
    rating: 4.9,
    reviewCount: 280,
    prepTime: '22 mins',
    calories: '610 kcal',
    ingredients: ['Tandoori chicken', 'Tomato puree', 'Fresh cream', 'Butter', 'Kasuri methi', 'Garlic naan', 'Aromatic spices'],
    instructions: 'Slow-simmered in clay pots and finished with fresh cream and clarified butter.'
  },
  {
    id: 'food-7',
    name: 'Avocado Quinoa Power Salad',
    category: 'Healthy & Salads',
    price: 12.99,
    isVeg: true,
    isAvailable: true,
    restaurantName: 'The Green Bowl Organic Cafe',
    image: 'https://cdn.dummyjson.com/recipe-images/7.webp',
    description: 'Organic tri-color quinoa, sliced Haas avocado, baby spinach, English cucumber, cherry tomatoes, and toasted pumpkin seeds with zesty lemon-herb dressing.',
    rating: 4.6,
    reviewCount: 110,
    prepTime: '12 mins',
    calories: '340 kcal',
    ingredients: ['Tri-color quinoa', 'Ripe avocado', 'Baby spinach', 'Cherry tomatoes', 'Pumpkin seeds', 'Lemon vinaigrette'],
    instructions: 'Assembled fresh in a chilled bowl and tossed with homemade cold-pressed vinaigrette.'
  },
  {
    id: 'food-8',
    name: 'Belgian Chocolate Lava Cake',
    category: 'Desserts & Bakery',
    price: 8.99,
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Sweet Velvet Bakery',
    image: 'https://cdn.dummyjson.com/recipe-images/8.webp',
    description: 'Warm rich dark chocolate cake with a molten Belgian chocolate center, dusted with powdered sugar and served with vanilla bean cream.',
    rating: 4.9,
    reviewCount: 340,
    prepTime: '15 mins',
    calories: '420 kcal',
    ingredients: ['Belgian dark chocolate', 'Butter', 'Farm eggs', 'Cane sugar', 'Flour', 'Vanilla bean'],
    instructions: 'Baked just enough to set the outer shell while keeping the luscious chocolate core completely liquid.'
  },
  {
    id: 'food-9',
    name: 'Crispy Truffle Fries',
    category: 'Burgers',
    price: 6.99,
    isVeg: true,
    isAvailable: false,
    restaurantName: 'The Rustic Burger Bar',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    description: 'Hand-cut Idaho russet potato fries fried twice for supreme crunch, tossed in white truffle oil, grated Pecorino, and fresh flat-leaf parsley.',
    rating: 4.7,
    reviewCount: 180,
    prepTime: '10 mins',
    calories: '380 kcal',
    ingredients: ['Russet potatoes', 'White truffle oil', 'Pecorino Romano', 'Sea salt', 'Parsley'],
    instructions: 'Double-fried at 190°C and seasoned while piping hot.'
  },
  {
    id: 'food-10',
    name: 'Fresh Dragonfruit Mango Smoothie',
    category: 'Beverages',
    price: 6.50,
    isVeg: true,
    isAvailable: true,
    restaurantName: 'The Green Bowl Organic Cafe',
    image: 'https://cdn.dummyjson.com/recipe-images/19.webp',
    description: 'Vibrant blend of pink dragonfruit (pitaya), Alphonso mango chunks, coconut water, and a touch of organic raw honey.',
    rating: 4.8,
    reviewCount: 95,
    prepTime: '5 mins',
    calories: '180 kcal',
    ingredients: ['Pink pitaya', 'Alphonso mango', 'Coconut water', 'Raw honey', 'Chia seeds'],
    instructions: 'Blended on high speed with crushed ice until silky and frost-topped.'
  }
];

// Helper to deduce a friendly category from recipe tags and name
const detectCategory = (recipe) => {
  const text = `${recipe.name || ''} ${(recipe.tags || []).join(' ')} ${recipe.cuisine || ''}`.toLowerCase();
  
  if (text.includes('pizza')) return 'Pizza';
  if (text.includes('burger') || text.includes('sandwich') || text.includes('fries')) return 'Burgers';
  if (text.includes('pasta') || text.includes('fettuccine') || text.includes('spaghetti') || text.includes('lasagna') || text.includes('risotto')) return 'Pasta & Italian';
  if (text.includes('ramen') || text.includes('noodle') || text.includes('sushi') || text.includes('dumpling') || text.includes('asian')) return 'Asian & Noodles';
  if (text.includes('taco') || text.includes('nacho') || text.includes('burrito') || text.includes('mexican')) return 'Mexican & Tacos';
  if (text.includes('curry') || text.includes('biryani') || text.includes('tikka') || text.includes('masala') || text.includes('indian')) return 'Indian Curries';
  if (text.includes('salad') || text.includes('bowl') || text.includes('vegan') || text.includes('organic')) return 'Healthy & Salads';
  if (text.includes('cake') || text.includes('dessert') || text.includes('cookie') || text.includes('gelato') || text.includes('sweet') || text.includes('pastry')) return 'Desserts & Bakery';
  if (text.includes('smoothie') || text.includes('drink') || text.includes('juice') || text.includes('tea') || text.includes('coffee')) return 'Beverages';
  
  return 'Pizza'; // default fallback
};

// Fetch menu items from API or retrieve cached/modified items from LocalStorage
export const fetchMenuItems = async () => {
  // Check if user has stored modified/custom menu items
  const savedItems = getStorageItem(MENU_STORAGE_KEY, null);
  if (savedItems && Array.isArray(savedItems) && savedItems.length > 0) {
    return savedItems;
  }

  try {
    // Fetch from Third-Party API
    const response = await apiClient.get('/recipes?limit=30');
    const recipes = response.data?.recipes || [];

    if (recipes.length === 0) {
      setStorageItem(MENU_STORAGE_KEY, FALLBACK_MENU_ITEMS);
      return FALLBACK_MENU_ITEMS;
    }

    // Map recipes into standardized food items
    const apiMenuItems = recipes.map((r, index) => {
      const category = detectCategory(r);
      const isVeg = (r.tags || []).some(t => t.toLowerCase().includes('vegetarian') || t.toLowerCase().includes('vegan')) ||
                    r.name.toLowerCase().includes('salad') ||
                    r.name.toLowerCase().includes('margherita') ||
                    r.name.toLowerCase().includes('paneer') ||
                    r.name.toLowerCase().includes('cake') ||
                    r.name.toLowerCase().includes('smoothie');
      
      const price = parseFloat((9.99 + ((r.id * 1.85) % 15)).toFixed(2));
      const prepMinutes = r.prepTimeMinutes || (15 + (index % 15));
      const caloriesVal = r.caloriesPerServing ? `${r.caloriesPerServing} kcal` : `${300 + (r.id * 25)} kcal`;

      return {
        id: `food-api-${r.id}`,
        name: r.name,
        category,
        price,
        isVeg,
        isAvailable: index % 7 !== 0, // Most available, 1 out of 7 out of stock for testing
        restaurantName: `${r.cuisine || 'Gourmet'} Bistro`,
        image: r.image || CATEGORY_SAMPLE_IMAGES[category] || CATEGORY_SAMPLE_IMAGES.Default,
        description: `Delicately prepared ${r.name} crafted with ${r.cuisine || 'fresh'} spices, fine culinary technique, and premium ingredients.`,
        rating: r.rating || 4.7,
        reviewCount: (r.reviewCount || 45) * 3,
        prepTime: `${prepMinutes} mins`,
        calories: caloriesVal,
        ingredients: r.ingredients || ['Fresh organic produce', 'Chef special sauce', 'Artisan herbs', 'Sea salt & olive oil'],
        instructions: Array.isArray(r.instructions) ? r.instructions.join(' ') : (r.instructions || 'Crafted fresh to order.')
      };
    });

    setStorageItem(MENU_STORAGE_KEY, apiMenuItems);
    return apiMenuItems;
  } catch (err) {
    console.warn('Third-Party API menu fetch failed, loading fallback items:', err);
    setStorageItem(MENU_STORAGE_KEY, FALLBACK_MENU_ITEMS);
    return FALLBACK_MENU_ITEMS;
  }
};

// Save updated menu items to LocalStorage
export const saveMenuItemsToStorage = (items) => {
  setStorageItem(MENU_STORAGE_KEY, items);
};
