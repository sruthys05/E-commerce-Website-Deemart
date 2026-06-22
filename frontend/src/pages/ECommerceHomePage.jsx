import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFlashSales, getBestSelling, getFeatured, searchProducts, addToCartAPI, addToWishlistAPI, getCartCount, getWishlistCount } from "../api";
import { Link } from "react-router-dom";

const StarRating = ({ filled }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= filled ? "#ffad33" : "#d1d5db"} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onToggleWishlist, inWishlist }) => (
  <div>
    <Link to={`/product/${product.id}`}>
      <div className="relative rounded-lg overflow-hidden mb-3 group" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <img src={product.img} alt={product.name} className="w-full h-[250px] object-cover" loading="lazy" onError={(e) => { e.target.src = "https://via.placeholder.com/270x250?text=Product"; }} />
        {product.discount && <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded">{product.discount}</span>}
        {product.badge && <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded">{product.badge}</span>}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onToggleWishlist(product.id); }}
            className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "#ef4444" : "none"} stroke={inWishlist ? "#ef4444" : "#333"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); onAddToCart(product.id); }}
          className="w-full py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Add To Cart
        </button>
      </div>
    </Link>
    <Link to={`/product/${product.id}`}>
      <h3 className="text-sm font-medium mb-1 truncate hover:text-blue-600 transition-colors" style={{ color: "var(--text-primary)" }}>{product.name}</h3>
    </Link>
    <div className="flex items-center gap-3 mb-1">
      <span className="text-sm font-medium text-blue-600">${product.price}</span>
      {product.oldPrice && <span className="text-xs line-through opacity-50" style={{ color: "var(--text-muted)" }}>${product.oldPrice}</span>}
    </div>
    <div className="flex items-center gap-2">
      <StarRating filled={5} />
      <span className="text-xs opacity-50" style={{ color: "var(--text-muted)" }}>({product.rating})</span>
    </div>
  </div>
);

const ECommerceHomePage = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getFlashSales().then(setFlashSales).catch(() => {});
    getBestSelling().then(setBestSelling).catch(() => {});
    getFeatured().then(setFeatured).catch(() => {});
    loadCounts();
    loadWishlistIds();
  }, []);

  const loadCounts = async () => {
    try {
      const [cc, wc] = await Promise.all([getCartCount(), getWishlistCount()]);
      setCartCount(cc.count);
      setWishlistCount(wc.count);
    } catch {}
  };

  const loadWishlistIds = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistIds(new Set(saved));
    } catch {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    try {
      const results = await searchProducts(searchQuery);
      setSearchResults(results);
      setMessage(searchResults?.length ? "" : "No results found");
    } catch { setMessage("Search failed"); }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCartAPI(productId);
      const cc = await getCartCount();
      setCartCount(cc.count);
      showNotification("Added to cart!");
    } catch { showNotification("Failed to add to cart"); }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      if (wishlistIds.has(productId)) {
        const { removeFromWishlistByProduct } = await import("../api");
        await removeFromWishlistByProduct(productId);
        wishlistIds.delete(productId);
        showNotification("Removed from wishlist");
      } else {
        await addToWishlistAPI(productId);
        wishlistIds.add(productId);
        showNotification("Added to wishlist!");
      }
      setWishlistIds(new Set(wishlistIds));
      const wc = await getWishlistCount();
      setWishlistCount(wc.count);
    } catch { showNotification("Failed to update wishlist"); }
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const categories = [
    { name: "Phones", icon: "📱" }, { name: "Computers", icon: "💻" },
    { name: "SmartWatch", icon: "⌚" }, { name: "Camera", icon: "📷" },
    { name: "Headphones", icon: "🎧" }, { name: "Gaming", icon: "🎮" },
  ];

  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar cartCount={cartCount} wishlistCount={wishlistCount} onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {message && (
        <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse">
          {message}
        </div>
      )}

      {searchResults !== null ? (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-10">
          <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
            Search Results {searchResults.length > 0 && `(${searchResults.length})`}
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-center py-20 text-lg opacity-50" style={{ color: "var(--text-muted)" }}>No products found for "{searchQuery}"</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} inWishlist={wishlistIds.has(p.id)} />
              ))}
            </div>
          )}
          <button onClick={() => setSearchResults(null)} className="mt-6 text-sm text-blue-600 hover:underline">Clear search</button>
        </section>
      ) : (
        <>
          {/* Hero + Sidebar */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-6 lg:py-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-[220px] flex-shrink-0 hidden lg:block" role="navigation" aria-label="Categories">
                <ul className="space-y-4 text-sm" style={{ color: "var(--text-primary)", fontFamily: "Poppins, sans-serif" }}>
                  {["Woman's Fashion", "Men's Fashion", "Electronics", "Home & Lifestyle", "Medicine", "Sports & Outdoor", "Baby's & Toys", "Groceries & Pets", "Health & Beauty"].map((cat) => (
                    <li key={cat} className="flex items-center justify-between hover:text-blue-600 cursor-pointer transition-colors">
                      <span>{cat}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </li>
                  ))}
                </ul>
              </aside>
              <div className="hidden lg:block w-px" style={{ backgroundColor: "var(--border-color)", opacity: 0.3 }} />
              <div className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden flex flex-col lg:flex-row items-center relative">
                <div className="p-6 lg:p-12 lg:w-1/2 z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-semibold text-blue-400">iPhone 14 Series</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Inter, sans-serif" }}>Up to 10% off Voucher</h2>
                  <a href="#shop" className="inline-flex items-center gap-2 text-white font-medium border-b-2 border-white pb-1 hover:opacity-80">Shop Now <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
                </div>
                <div className="lg:w-1/2 flex items-center justify-center p-4">
                  <img src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=400&fit=crop" alt="iPhone" className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </section>

          {/* Flash Sales */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-10">
            <div className="flex items-center gap-4 mb-6"><div className="w-5 h-10 rounded bg-blue-600" /><span className="text-sm font-semibold text-blue-600">Today's</span></div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>Flash Sales</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {flashSales.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} inWishlist={wishlistIds.has(p.id)} />
              ))}
            </div>
            <div className="w-full h-px my-12 opacity-20" style={{ backgroundColor: "var(--border-color)" }} />
          </section>

          {/* Categories */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-10">
            <div className="flex items-center gap-4 mb-6"><div className="w-5 h-10 rounded bg-blue-600" /><span className="text-sm font-semibold text-blue-600">Categories</span></div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>Browse By Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <div key={cat.name} className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border cursor-pointer hover:bg-blue-600 hover:text-white transition-all" style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }} tabIndex={0} role="button" aria-label={cat.name}>
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Best Selling */}
          {bestSelling.length > 0 && (
            <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-10">
              <div className="flex items-center gap-4 mb-6"><div className="w-5 h-10 rounded bg-blue-600" /><span className="text-sm font-semibold text-blue-600">This Month</span></div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>Best Selling Products</h2>
                <button className="px-8 py-3 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">View All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSelling.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} inWishlist={wishlistIds.has(p.id)} />
                ))}
              </div>
            </section>
          )}

          {/* Music Banner */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-10">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden flex flex-col lg:flex-row items-center p-8 lg:p-16">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <span className="text-sm font-semibold text-green-400 mb-4 block">Categories</span>
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Enhance Your Music Experience</h2>
                <div className="flex gap-4 mb-8">
                  {[{ label: "Days", val: "05" }, { label: "Hours", val: "23" }, { label: "Minutes", val: "59" }, { label: "Seconds", val: "35" }].map(({ label, val }) => (
                    <div key={label} className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-black">{val}</span>
                      <span className="text-[10px] text-black/60">{label}</span>
                    </div>
                  ))}
                </div>
                <button className="px-10 py-3 rounded text-sm font-semibold text-white bg-green-500 hover:bg-green-600">Buy Now!</button>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img src="https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=400&fit=crop" alt="Speakers" className="w-full max-w-[450px] h-auto drop-shadow-2xl" />
              </div>
            </div>
          </section>

          {/* Featured Products */}
          {featured.length > 0 && (
            <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-10">
              <div className="flex items-center gap-4 mb-6"><div className="w-5 h-10 rounded bg-blue-600" /><span className="text-sm font-semibold text-blue-600">Our Products</span></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>Explore Our Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} inWishlist={wishlistIds.has(p.id)} />
                ))}
              </div>
              <div className="text-center mt-10">
                <button className="px-12 py-3.5 rounded text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">View All Products</button>
              </div>
            </section>
          )}

          {/* Services */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { icon: "🚚", title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140" },
                { icon: "🎧", title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support" },
                { icon: "🛡️", title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days" },
                { icon: "🎁", title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-4" style={{ color: "var(--text-primary)" }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: "var(--bg-secondary)" }}><span className="text-4xl">{icon}</span></div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="text-xs opacity-60">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      <Footer />
    </div>
  );
};

export default ECommerceHomePage;