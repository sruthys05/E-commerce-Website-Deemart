import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProduct, getProductReviews, getRelatedProducts, addToCartAPI, addToWishlistAPI, removeFromWishlistByProduct, checkWishlist, getCartCount } from "../api";

const StarRating = ({ filled, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= filled ? "#ffad33" : "#d1d5db"}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProduct(id),
      getProductReviews(id),
      getRelatedProducts(id),
      getCartCount(),
    ]).then(([p, revs, related, cc]) => {
      setProduct(p);
      setReviews(revs || []);
      setRelatedProducts(related || []);
      setCartCount(cc?.count || 0);
      setLoading(false);
    }).catch(() => setLoading(false));

    checkWishlist(id).then((r) => setInWishlist(r.inWishlist)).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCartAPI(product.id, qty);
      const cc = await getCartCount();
      setCartCount(cc.count);
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch { setMessage("Failed to add"); }
  };

  const handleToggleWishlist = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlistByProduct(product.id);
        setInWishlist(false);
        setMessage("Removed from wishlist");
      } else {
        await addToWishlistAPI(product.id);
        setInWishlist(true);
        setMessage("Added to wishlist!");
      }
      setTimeout(() => setMessage(""), 2000);
    } catch { setMessage("Failed to update"); }
  };

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { if (dist[r.rating]) dist[r.rating]++; });
    return dist;
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) return <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}><Navbar cartCount={cartCount} /><div className="text-center py-20 text-lg">Loading...</div></div>;
  if (!product) return <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}><Navbar cartCount={cartCount} /><div className="text-center py-20 text-lg">Product not found</div></div>;

  const dist = getRatingDistribution();
  const images = [product.img, product.img];

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar cartCount={cartCount} />
      {message && <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse">{message}</div>}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <nav className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          <Link to="/" className="hover:underline">Home</Link> / <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden mb-4" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-[400px] lg:h-[500px] object-cover transition-all duration-300"
                onError={(e) => { e.target.src = "https://via.placeholder.com/500x500?text=Product"; }}
              />
            </div>
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: selectedImage === idx ? "var(--accent-color)" : "var(--border-color)",
                    opacity: selectedImage === idx ? 1 : 0.6,
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-1/2">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRating filled={5} size={16} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>({product.rating} Reviews)</span>
              <span className="text-sm text-green-600 font-medium">| In Stock ({product.stock} units)</span>
            </div>
            <p className="text-2xl font-bold mb-4" style={{ color: "var(--accent-color)" }}>
              ${product.price}
              {product.oldPrice && <span className="text-lg line-through ml-3 opacity-50" style={{ color: "var(--text-muted)" }}>${product.oldPrice}</span>}
            </p>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{product.description || "High quality product with premium features. Perfect for your daily needs."}</p>

            <div className="h-px my-6" style={{ backgroundColor: "var(--border-color)" }} />

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded" style={{ borderColor: "var(--border-color)" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg border-r hover:bg-gray-100" style={{ borderColor: "var(--border-color)" }}>-</button>
                <span className="px-6 py-2 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="px-4 py-2 text-lg border-l hover:bg-gray-100" style={{ borderColor: "var(--border-color)" }}>+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 px-6 py-3 rounded text-sm font-semibold text-white transition-colors" style={{ backgroundColor: "var(--accent-color)" }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "var(--accent-hover)"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "var(--accent-color)"}>
                Add To Cart
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-6 mb-6">
              <button onClick={handleToggleWishlist} className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: inWishlist ? "#ef4444" : "var(--text-primary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "#ef4444" : "none"} stroke={inWishlist ? "#ef4444" : "currentColor"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              <button className="flex items-center gap-2 text-sm font-medium hover:opacity-80" style={{ color: "var(--text-primary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>

            {/* Info boxes */}
            <div className="border rounded-lg overflow-hidden text-sm" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center gap-3 p-4"><span className="text-lg">🚚</span><span>Free Delivery <span className="opacity-60" style={{ color: "var(--text-muted)" }}>— Enter your postal code for delivery availability</span></span></div>
              <div className="h-px" style={{ backgroundColor: "var(--border-color)" }} />
              <div className="flex items-center gap-3 p-4"><span className="text-lg">🔄</span><span>Return Delivery <span className="opacity-60" style={{ color: "var(--text-muted)" }}>— Free 30 Days Delivery Returns. <a href="#" className="text-blue-600 hover:underline">Details</a></span></span></div>
            </div>
          </div>
        </div>

        {/* Tabs: Description | Reviews */}
        <div className="mb-16">
          <div className="flex border-b mb-8" style={{ borderColor: "var(--border-color)" }}>
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-3 text-sm font-medium transition-all relative"
                style={{ color: activeTab === tab ? "var(--accent-color)" : "var(--text-muted)" }}
              >
                {tab === "description" ? "Description" : `Reviews (${reviews.length})`}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ backgroundColor: "var(--accent-color)" }} />
                )}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <div className="text-sm leading-relaxed space-y-4" style={{ color: "var(--text-secondary)" }}>
              <p>{product.description}</p>
              <p>Category: <strong>{product.category}</strong></p>
              <p>Stock: <strong>{product.stock} units</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Premium quality materials</li>
                <li>1 year manufacturer warranty</li>
                <li>Free shipping on orders over $140</li>
                <li>30-day hassle-free returns</li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Rating Breakdown */}
              <div className="lg:w-1/3">
                <div className="p-6 rounded-xl" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{avgRating}</span>
                    <div className="flex justify-center my-2"><StarRating filled={Math.round(Number(avgRating))} /></div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{reviews.length} total reviews</p>
                  </div>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 mb-2 text-xs">
                      <span style={{ color: "var(--text-primary)" }}>{star} ★</span>
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
                        <div className="h-full rounded-full" style={{ width: `${reviews.length > 0 ? (dist[star] / reviews.length) * 100 : 0}%`, backgroundColor: "#ffad33" }} />
                      </div>
                      <span style={{ color: "var(--text-muted)" }}>{dist[star]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="flex-1 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm py-10 text-center" style={{ color: "var(--text-muted)" }}>No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{review.user}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating filled={review.rating} size={12} />
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-5 h-10 rounded bg-blue-600" />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Related Items</span>
            </div>
            <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="rounded-lg overflow-hidden mb-3" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <img src={p.img} alt={p.name} className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <h3 className="text-sm font-medium mb-1 truncate group-hover:text-blue-600" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-600">₹{p.price}</span>
                    {p.oldPrice && <span className="text-xs line-through opacity-50" style={{ color: "var(--text-muted)" }}>{p.oldPrice}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;