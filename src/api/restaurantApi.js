import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_KEY_CUSTOM_RESTAURANTS = 'foodapp_custom_restaurants_v1';

// Curated high quality restaurant images for varied cuisines
const CUISINE_IMAGES = {
  Italian: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  Asian: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  American: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
  Mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
  Indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
  Mediterranean: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  Japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
  Desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
  Healthy: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  Default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
};

const RESTAURANT_NAMES_BY_CUISINE = {
  Italian: ['Bella Napoli Trattoria', 'Roma Osteria & Pasta', 'La Dolce Vita Pizzeria'],
  Asian: ['Golden Dragon Wok', 'Tokyo Sushi Zen', 'Bangkok Street Kitchen'],
  American: ['The Rustic Burger & Smokehouse', 'Metro Grill House', 'Skyline BBQ Diner'],
  Mexican: ['El Sombrero Cantina', 'Taqueria Dos Hermanos', 'Fiesta Brava Tacos'],
  Indian: ['Royal Taj Curry Palace', 'Spice Symphony Bistro', 'Punjab Heritage Dhaba'],
  Mediterranean: ['Santorini Olive & Grill', 'Zaytoun Mezze House', 'Aegean Coast Kitchen'],
  Japanese: ['Sakura Ramen House', 'Oishii Sushi Bar', 'Kyoto Izakaya Lounge'],
  Desserts: ['Sweet Velvet Bakery & Gelato', 'ChocoCraze Patisserie', 'Sugar & Spice Delights'],
  Healthy: ['The Green Bowl Organic Cafe', 'Pure Vida Vitality Bowls', 'Fresh Harvest Salad Bar']
};

const ADDRESSES = [
  '142 Ocean Avenue, Downtown District',
  '78 Market Street, Metro Plaza',
  '305 Sunset Boulevard, West End',
  '91 Grand Boulevard, Culinary Quarter',
  '210 Park Avenue, Central Square',
  '514 Riverside Drive, Harbor Point',
  '88 Pine Street, Uptown Arts District',
  '120 Baker Street, Old Town Square',
  '45 Highland Avenue, Garden Heights',
  '620 Lexington Way, Innovation Hub',
  '33 Broad Street, Financial District',
  '19 Elmwood Road, Midtown Crossing'
];

// Fallback seed restaurants in case API network is restricted
const FALLBACK_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Bella Napoli Trattoria',
    cuisine: 'Italian',
    rating: 4.8,
    reviewCount: 320,
    deliveryTime: '20-30 min',
    deliveryFee: 0,
    address: '142 Ocean Avenue, Downtown District',
    isOpen: true,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    description: 'Authentic wood-fired Neapolitan pizzas, handcrafted pasta, and Mediterranean desserts crafted with family recipes.',
    phone: '+1 (555) 234-5678',
    features: ['Wood-Fired Oven', 'Free Delivery', 'Contactless Dropoff', 'Top Rated'],
    dishes: [
      { id: 'dish-1', name: 'Classic Margherita Pizza', price: 14.99, image: 'https://cdn.dummyjson.com/recipe-images/1.webp', isVeg: true },
      { id: 'dish-2', name: 'Truffle Mushroom Risotto', price: 18.50, image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80', isVeg: true },
      { id: 'dish-3', name: 'Creamy Fettuccine Alfredo', price: 16.20, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80', isVeg: false }
    ]
  },
  {
    id: 'rest-2',
    name: 'Tokyo Sushi Zen',
    cuisine: 'Asian',
    rating: 4.9,
    reviewCount: 450,
    deliveryTime: '25-35 min',
    deliveryFee: 1.99,
    address: '78 Market Street, Metro Plaza',
    isOpen: true,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    description: 'Artisanal sushi rolls, fresh sashimi platters, and steaming traditional ramen made by master chefs.',
    phone: '+1 (555) 876-5432',
    features: ['Fresh Fish Daily', 'Express Prep', 'Eco Packaging'],
    dishes: [
      { id: 'dish-4', name: 'Salmon Avocado Roll', price: 15.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&auto=format&fit=crop&q=80', isVeg: false },
      { id: 'dish-5', name: 'Tonkotsu Ramen Bowl', price: 17.50, image: 'https://cdn.dummyjson.com/recipe-images/10.webp', isVeg: false },
      { id: 'dish-6', name: 'Crispy Veggie Gyoza', price: 9.99, image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80', isVeg: true }
    ]
  },
  {
    id: 'rest-3',
    name: 'The Rustic Burger Bar',
    cuisine: 'American',
    rating: 4.7,
    reviewCount: 290,
    deliveryTime: '15-25 min',
    deliveryFee: 0,
    address: '305 Sunset Boulevard, West End',
    isOpen: true,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy smashed Angus patties, melted artisan cheddar, brioche buns, and golden loaded potato fries.',
    phone: '+1 (555) 345-6789',
    features: ['100% Angus Beef', 'Free Delivery', 'Super Fast'],
    dishes: [
      { id: 'dish-7', name: 'Double Bacon Smash Burger', price: 13.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', isVeg: false },
      { id: 'dish-8', name: 'Truffle Parmesan Fries', price: 6.99, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80', isVeg: true },
      { id: 'dish-9', name: 'Crispy Chicken Sandwich', price: 12.50, image: 'https://cdn.dummyjson.com/recipe-images/3.webp', isVeg: false }
    ]
  },
  {
    id: 'rest-4',
    name: 'Royal Taj Curry Palace',
    cuisine: 'Indian',
    rating: 4.8,
    reviewCount: 380,
    deliveryTime: '30-40 min',
    deliveryFee: 2.49,
    address: '91 Grand Boulevard, Culinary Quarter',
    isOpen: true,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    description: 'Aromatic Mughlai gravies, butter-brushed garlic naans, saffron basmati biryanis, and rich spiced delicacies.',
    phone: '+1 (555) 901-2345',
    features: ['Halal Certified', 'Spicy Levels', 'Clay Tandoor'],
    dishes: [
      { id: 'dish-10', name: 'Butter Chicken Masala', price: 16.99, image: 'https://cdn.dummyjson.com/recipe-images/6.webp', isVeg: false },
      { id: 'dish-11', name: 'Paneer Tikka & Garlic Naan', price: 14.50, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80', isVeg: true },
      { id: 'dish-12', name: 'Hyderabadi Dum Biryani', price: 17.99, image: 'https://cdn.dummyjson.com/recipe-images/14.webp', isVeg: false }
    ]
  },
  {
    id: 'rest-5',
    name: 'El Sombrero Cantina',
    cuisine: 'Mexican',
    rating: 4.6,
    reviewCount: 215,
    deliveryTime: '20-30 min',
    deliveryFee: 1.49,
    address: '210 Park Avenue, Central Square',
    isOpen: true,
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    description: 'Street-style corn tacos, loaded guacamole bowls, sizzling fajita skillets, and churros with chocolate dip.',
    phone: '+1 (555) 432-1098',
    features: ['Fresh Guacamole', 'Great Value', 'Outdoor Smoker'],
    dishes: [
      { id: 'dish-13', name: 'Street Beef Birria Tacos', price: 12.99, image: 'https://cdn.dummyjson.com/recipe-images/4.webp', isVeg: false },
      { id: 'dish-14', name: 'Cheesy Loaded Nachos', price: 10.50, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80', isVeg: true },
      { id: 'dish-15', name: 'Cinnamon Sugar Churros', price: 6.50, image: 'https://cdn.dummyjson.com/recipe-images/17.webp', isVeg: true }
    ]
  },
  {
    id: 'rest-6',
    name: 'The Green Bowl Organic Cafe',
    cuisine: 'Healthy',
    rating: 4.7,
    reviewCount: 195,
    deliveryTime: '20-30 min',
    deliveryFee: 0,
    address: '514 Riverside Drive, Harbor Point',
    isOpen: true,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    description: 'Wholesome superfood bowls, cold-pressed fruit juices, organic quinoa salads, and high-protein vegan meals.',
    phone: '+1 (555) 678-9012',
    features: ['100% Organic', 'Gluten Free Options', 'Vegan Friendly'],
    dishes: [
      { id: 'dish-16', name: 'Avocado Quinoa Power Bowl', price: 13.50, image: 'https://cdn.dummyjson.com/recipe-images/7.webp', isVeg: true },
      { id: 'dish-17', name: 'Berry Antioxidant Smoothie', price: 7.99, image: 'https://cdn.dummyjson.com/recipe-images/19.webp', isVeg: true },
      { id: 'dish-18', name: 'Grilled Herb Chicken Salad', price: 14.25, image: 'https://cdn.dummyjson.com/recipe-images/2.webp', isVeg: false }
    ]
  },
  {
    id: 'rest-7',
    name: 'Sweet Velvet Bakery & Gelato',
    cuisine: 'Desserts',
    rating: 4.9,
    reviewCount: 510,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    address: '88 Pine Street, Uptown Arts District',
    isOpen: false,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    description: 'European patisserie cakes, freshly churned pistachio gelato, warm cookies, and specialty espresso coffees.',
    phone: '+1 (555) 789-0123',
    features: ['Pastry Chef Specials', 'Bespoke Cakes', 'Dessert Heaven'],
    dishes: [
      { id: 'dish-19', name: 'Belgian Chocolate Fudge Cake', price: 8.50, image: 'https://cdn.dummyjson.com/recipe-images/8.webp', isVeg: true },
      { id: 'dish-20', name: 'Pistachio Artisan Gelato Pint', price: 9.99, image: 'https://cdn.dummyjson.com/recipe-images/21.webp', isVeg: true }
    ]
  },
  {
    id: 'rest-8',
    name: 'Santorini Olive & Grill',
    cuisine: 'Mediterranean',
    rating: 4.6,
    reviewCount: 165,
    deliveryTime: '25-35 min',
    deliveryFee: 2.00,
    address: '120 Baker Street, Old Town Square',
    isOpen: true,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    description: 'Greek grilled souvlaki skewers, creamy tzatziki dips, fresh Greek salad with kalamata olives and warm pita bread.',
    phone: '+1 (555) 890-1234',
    features: ['Greek Olive Oil', 'Charcoal Grilled', 'Family Run'],
    dishes: [
      { id: 'dish-21', name: 'Lamb Souvlaki Plate', price: 18.00, image: 'https://cdn.dummyjson.com/recipe-images/9.webp', isVeg: false },
      { id: 'dish-22', name: 'Hummus & Warm Pita Platter', price: 9.50, image: 'https://cdn.dummyjson.com/recipe-images/22.webp', isVeg: true }
    ]
  }
];

// Fetch restaurants with Third-Party API integration (DummyJSON recipes)
export const fetchRestaurantsFromApi = async () => {
  try {
    // Call Third Party API: https://dummyjson.com/recipes
    const response = await apiClient.get('/recipes?limit=30');
    const recipes = response.data?.recipes || [];

    if (recipes.length === 0) {
      return getStoredOrFallbackRestaurants();
    }

    // Group recipes by cuisine to build rich restaurants
    const cuisineGroups = {};
    recipes.forEach((recipe) => {
      const cuisine = recipe.cuisine || 'International';
      if (!cuisineGroups[cuisine]) {
        cuisineGroups[cuisine] = [];
      }
      cuisineGroups[cuisine].push(recipe);
    });

    const generatedRestaurants = [];
    let restIndex = 1;

    Object.entries(cuisineGroups).forEach(([cuisine, recipeList]) => {
      // Create 1 or 2 restaurants per cuisine group
      const names = RESTAURANT_NAMES_BY_CUISINE[cuisine] || [
        `${cuisine} Gourmet Kitchen`,
        `${cuisine} Heritage Flavors`,
        `Grand ${cuisine} Table`
      ];

      const chunks = [];
      if (recipeList.length > 2) {
        chunks.push(recipeList.slice(0, Math.ceil(recipeList.length / 2)));
        chunks.push(recipeList.slice(Math.ceil(recipeList.length / 2)));
      } else {
        chunks.push(recipeList);
      }

      chunks.forEach((chunk, chunkIdx) => {
        const primaryRecipe = chunk[0];
        const restaurantName = names[chunkIdx % names.length] || `${cuisine} Express`;
        const address = ADDRESSES[(restIndex - 1) % ADDRESSES.length];
        
        // Delivery fee: 0 (free delivery) or between $1.49 and $2.99
        const isFree = restIndex % 3 === 0;
        const deliveryFee = isFree ? 0 : [1.49, 1.99, 2.49, 2.99][restIndex % 4];

        // Prep time from recipe
        const prep = primaryRecipe.prepTimeMinutes || 20;
        const deliveryTime = `${Math.max(15, prep)}-${prep + 15} min`;

        const restaurantImage = CUISINE_IMAGES[cuisine] || primaryRecipe.image || CUISINE_IMAGES.Default;

        // Map recipes into dishes
        const dishes = chunk.map((r) => ({
          id: `dish-api-${r.id}`,
          name: r.name,
          price: parseFloat((10 + ((r.id * 1.7) % 12)).toFixed(2)),
          image: r.image,
          rating: r.rating || 4.5,
          calories: r.caloriesPerServing,
          prepTime: r.prepTimeMinutes,
          difficulty: r.difficulty,
          tags: r.tags || [],
          isVeg: (r.tags || []).some(t => t.toLowerCase().includes('vegetarian') || t.toLowerCase().includes('vegan')) || (r.name.toLowerCase().includes('salad') || r.name.toLowerCase().includes('paneer'))
        }));

        generatedRestaurants.push({
          id: `rest-api-${primaryRecipe.id}`,
          name: restaurantName,
          cuisine: cuisine,
          rating: primaryRecipe.rating || 4.7,
          reviewCount: primaryRecipe.reviewCount ? primaryRecipe.reviewCount * 4 : 120 + (restIndex * 27),
          deliveryTime,
          deliveryFee,
          address,
          isOpen: restIndex % 8 !== 0, // Most open, 1 closed for testing filter
          priceRange: restIndex % 2 === 0 ? '$$' : '$$$',
          image: restaurantImage,
          description: `Renowned for delectable ${cuisine} specialties including ${primaryRecipe.name}, prepared fresh with premium quality ingredients.`,
          phone: `+1 (555) 0${10 + restIndex}-${2000 + restIndex}`,
          features: [
            isFree ? 'Free Delivery' : 'Fast Delivery',
            'Live Tracking',
            'Top Rated'
          ],
          dishes
        });

        restIndex++;
      });
    });

    // Merge with user-added custom restaurants
    const customRestaurants = getStorageItem(STORAGE_KEY_CUSTOM_RESTAURANTS, []);
    return [...customRestaurants, ...generatedRestaurants];
  } catch (error) {
    console.warn('Third-party API request failed, loading reliable fallback dataset:', error);
    return getStoredOrFallbackRestaurants();
  }
};

const getStoredOrFallbackRestaurants = () => {
  const customRestaurants = getStorageItem(STORAGE_KEY_CUSTOM_RESTAURANTS, []);
  return [...customRestaurants, ...FALLBACK_RESTAURANTS];
};

// Add a new restaurant to local storage
export const saveNewRestaurant = (newRestaurantData) => {
  const customRestaurants = getStorageItem(STORAGE_KEY_CUSTOM_RESTAURANTS, []);
  const newRestaurant = {
    ...newRestaurantData,
    id: `custom-rest-${Date.now()}`,
    rating: parseFloat(newRestaurantData.rating) || 4.8,
    reviewCount: 1,
    deliveryFee: parseFloat(newRestaurantData.deliveryFee) || 0,
    isOpen: newRestaurantData.isOpen !== undefined ? Boolean(newRestaurantData.isOpen) : true,
    image: newRestaurantData.image || CUISINE_IMAGES[newRestaurantData.cuisine] || CUISINE_IMAGES.Default,
    features: ['Newly Added', 'Fresh Partner'],
    dishes: [
      {
        id: `dish-cust-${Date.now()}`,
        name: `${newRestaurantData.name} Signature Dish`,
        price: 14.99,
        image: newRestaurantData.image || CUISINE_IMAGES.Default,
        isVeg: false
      }
    ]
  };

  const updated = [newRestaurant, ...customRestaurants];
  setStorageItem(STORAGE_KEY_CUSTOM_RESTAURANTS, updated);
  return newRestaurant;
};
