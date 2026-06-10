// Fallback local product data - shows without backend
const products = [
  { id: 1, name: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, discount: "-40%", rating: 88, img: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=270&h=250&fit=crop", badge: null, description: "High quality gaming gamepad", category: "Gaming", stock: 50 },
  { id: 2, name: "IPS LCD Gaming Monitor", price: 370, oldPrice: 400, discount: "-30%", rating: 99, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=270&h=250&fit=crop", badge: null, description: "27 inch IPS LCD monitor", category: "Electronics", stock: 50 },
  { id: 3, name: "AK-900 Wired Keyboard", price: 960, oldPrice: 1160, discount: null, rating: 75, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=270&h=250&fit=crop", badge: null, description: "Mechanical wired keyboard with RGB", category: "Electronics", stock: 50 },
  { id: 4, name: "S-Series Comfort Chair", price: 375, oldPrice: 400, discount: "-25%", rating: 99, img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=270&h=250&fit=crop", badge: null, description: "Ergonomic office chair", category: "Furniture", stock: 50 },
  { id: 5, name: "The north coat", price: 260, oldPrice: 360, discount: null, rating: 65, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=270&h=250&fit=crop", badge: null, description: "Premium winter coat", category: "Fashion", stock: 50 },
  { id: 6, name: "Gucci duffle bag", price: 960, oldPrice: 1160, discount: null, rating: 65, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=270&h=250&fit=crop", badge: null, description: "Luxury Gucci duffle bag", category: "Fashion", stock: 50 },
  { id: 7, name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, discount: null, rating: 65, img: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=270&h=250&fit=crop", badge: null, description: "High performance liquid cooler", category: "Electronics", stock: 50 },
  { id: 8, name: "Small BookSelf", price: 360, oldPrice: null, discount: null, rating: 65, img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=270&h=250&fit=crop", badge: null, description: "Compact bookshelf for home", category: "Furniture", stock: 50 },
  { id: 9, name: "Breed Dry Dog Food", price: 100, oldPrice: null, discount: null, rating: 35, img: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=270&h=250&fit=crop", badge: null, description: "Nutritious dry dog food", category: "Pet Supplies", stock: 50 },
  { id: 10, name: "CANON EOS DSLR Camera", price: 360, oldPrice: null, discount: null, rating: 95, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=270&h=250&fit=crop", badge: null, description: "Professional DSLR camera", category: "Electronics", stock: 50 },
  { id: 11, name: "ASUS FHD Gaming Laptop", price: 700, oldPrice: null, discount: null, rating: 325, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=270&h=250&fit=crop", badge: null, description: "High performance gaming laptop", category: "Electronics", stock: 50 },
  { id: 12, name: "Curology Product Set", price: 500, oldPrice: null, discount: null, rating: 145, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=270&h=250&fit=crop", badge: null, description: "Skincare product set", category: "Beauty", stock: 50 },
  { id: 13, name: "Kids Electric Car", price: 960, oldPrice: null, discount: null, rating: 65, img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=270&h=250&fit=crop", badge: "NEW", description: "Electric ride-on car for kids", category: "Toys", stock: 50 },
  { id: 14, name: "Jr. Zoom Soccer Cleats", price: 1160, oldPrice: null, discount: null, rating: 35, img: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=270&h=250&fit=crop", badge: null, description: "Professional soccer cleats", category: "Sports", stock: 50 },
  { id: 15, name: "GP11 Shooter USB Gamepad", price: 660, oldPrice: null, discount: null, rating: 55, img: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=270&h=250&fit=crop", badge: null, description: "USB gamepad for PC gaming", category: "Gaming", stock: 50 },
  { id: 16, name: "Quilted Satin Jacket", price: 660, oldPrice: null, discount: null, rating: 55, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=270&h=250&fit=crop", badge: null, description: "Stylish quilted satin jacket", category: "Fashion", stock: 50 },
  { id: 17, name: "PlayStation 5", price: 499, oldPrice: null, discount: null, rating: 250, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=270&h=250&fit=crop", badge: null, description: "Next-gen gaming console", category: "Gaming", stock: 50 },
  { id: 18, name: "Wireless Headphones", price: 299, oldPrice: 350, discount: "-15%", rating: 180, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=270&h=250&fit=crop", badge: null, description: "Premium wireless headphones", category: "Electronics", stock: 50 },
  { id: 19, name: "Smart Watch", price: 199, oldPrice: 250, discount: "-20%", rating: 140, img: "https://images.unsplash.com/photo-1546868871-af0de0ae72c7?w=270&h=250&fit=crop", badge: null, description: "Feature-rich smartwatch", category: "Electronics", stock: 50 },
  { id: 20, name: "Men's Fashion Jacket", price: 189, oldPrice: 230, discount: "-18%", rating: 88, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=270&h=250&fit=crop", badge: null, description: "Stylish mens jacket", category: "Fashion", stock: 50 },
];

// Session-based local cart/wishlist (no backend needed)
function getSessionId() {
  let id = localStorage.getItem("sessionId");
  if (!id) {
    id = "sess_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("sessionId", id);
  }
  return id;
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

const reviews = [
  { id: 1, productId: 1, user: "Alex M.", rating: 5, date: "2025-12-15", text: "Excellent gamepad! Very responsive and comfortable for long gaming sessions." },
  { id: 2, productId: 1, user: "Jessica K.", rating: 4, date: "2025-12-10", text: "Great quality for the price. The buttons feel premium." },
  { id: 3, productId: 2, user: "Mark T.", rating: 5, date: "2025-12-08", text: "Stunning display! Colors are vibrant and the 144Hz refresh rate is amazing." },
  { id: 4, productId: 2, user: "Sarah L.", rating: 4, date: "2025-11-28", text: "Great monitor for gaming. Would recommend." },
  { id: 5, productId: 3, user: "David R.", rating: 5, date: "2025-12-01", text: "Best keyboard I've ever owned. The RGB is gorgeous." },
  { id: 6, productId: 10, user: "Emily W.", rating: 5, date: "2025-12-18", text: "Incredible camera! The image quality is outstanding." },
  { id: 7, productId: 11, user: "Chris P.", rating: 4, date: "2025-12-05", text: "Powerful laptop for gaming and work. Battery life could be better." },
  { id: 8, productId: 17, user: "Mike J.", rating: 5, date: "2025-12-20", text: "PS5 is amazing! Fast loading times and great graphics." },
  { id: 9, productId: 18, user: "Anna S.", rating: 4, date: "2025-12-12", text: "Comfortable headphones with excellent sound quality." },
  { id: 10, productId: 19, user: "Tom H.", rating: 5, date: "2025-12-22", text: "Feature-packed smartwatch at a great price point." },
];

export const localData = {
  products,
  reviews,
  getFlashSales: () => products.slice(0, 5),
  getBestSelling: () => products.slice(5, 9),
  getFeatured: () => products.slice(8, 16),
  getProduct: (id) => products.find(p => p.id === Number(id)),
  getProductReviews: (productId) => reviews.filter(r => r.productId === Number(productId)),
  getRelatedProducts: (productId, count = 4) => {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== Number(productId)).slice(0, count);
  },
  search: (q) => products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())),

  // Cart
  getCart: () => getCart().map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId),
  })),
  addToCart: (productId, quantity = 1) => {
    const cart = getCart();
    const existing = cart.find(i => i.productId === productId);
    if (existing) existing.quantity += quantity;
    else cart.push({ id: Date.now(), productId, quantity });
    saveCart(cart);
  },
  updateCartItem: (itemId, quantity) => {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) item.quantity = quantity;
    saveCart(cart);
  },
  removeFromCart: (itemId) => {
    saveCart(getCart().filter(i => i.id !== itemId));
  },
  getCartCount: () => getCart().reduce((sum, i) => sum + i.quantity, 0),

  // Wishlist
  getWishlist: () => getWishlist().map(id => ({
    id,
    product: products.find(p => p.id === id),
  })),
  toggleWishlist: (productId) => {
    const wishlist = getWishlist();
    if (wishlist.includes(productId)) {
      saveWishlist(wishlist.filter(id => id !== productId));
      return false;
    } else {
      saveWishlist([...wishlist, productId]);
      return true;
    }
  },
  isInWishlist: (productId) => getWishlist().includes(productId),
  getWishlistCount: () => getWishlist().length,
};