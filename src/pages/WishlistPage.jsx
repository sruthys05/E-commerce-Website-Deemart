import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getWishlist, removeFromWishlist, addToCartAPI, getWishlistCount, getCartCount } from "../api";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => { loadWishlist(); }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setItems(data || []);
      const [wc, cc] = await Promise.all([getWishlistCount(), getCartCount()]);
      setWishlistCount(wc?.count || 0);
      setCartCount(cc?.count || 0);
    } catch {}
    setLoading(false);
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(itemId);
      const wc = await getWishlistCount();
      setWishlistCount(wc.count);
      showNotification("Removed from wishlist");
      await loadWishlist();
    } catch {}
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCartAPI(productId);
      const cc = await getCartCount();
      setCartCount(cc.count);
      showNotification("Added to cart!");
    } catch { showNotification("Failed to add"); }
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar cartCount={cartCount} wishlistCount={wishlistCount} />
      {message && <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse">{message}</div>}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <nav className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          <Link to="/" className="hover:underline">Home</Link> / <span style={{ color: "var(--text-primary)" }}>Wishlist</span>
        </nav>

        {loading ? (
          <div className="text-center py-20 text-lg">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Your wishlist is empty</h2>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>Save your favorite items here.</p>
            <Link to="/" className="px-8 py-3 rounded text-sm font-medium text-white" style={{ backgroundColor: "var(--accent-color)" }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>My Wishlist ({items.length})</h2>
              <Link to="/" className="px-6 py-3 rounded border text-sm font-medium hover:opacity-80" style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                Continue Shopping
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative rounded-lg overflow-hidden mb-3" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <Link to={`/product/${item.product.id}`}>
                      <img
                        src={item.product.img}
                        alt={item.product.name}
                        className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/270x250"; }}
                      />
                    </Link>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                    {item.product.discount && <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded">{item.product.discount}</span>}
                    {item.product.badge && <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded">{item.product.badge}</span>}
                  </div>
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="text-sm font-medium mb-1 truncate hover:text-blue-600" style={{ color: "var(--text-primary)" }}>{item.product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-blue-600">${item.product.price}</span>
                    {item.product.oldPrice && <span className="text-xs line-through opacity-50" style={{ color: "var(--text-muted)" }}>${item.product.oldPrice}</span>}
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    className="w-full py-2.5 rounded text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: "var(--accent-color)" }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "var(--accent-hover)"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "var(--accent-color)"}
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;