import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCart, updateCartItem, removeFromCart, getCartCount } from "../api";

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setItems(data);
      const cc = await getCartCount();
      setCartCount(cc.count);
    } catch {}
    setLoading(false);
  };

  const handleQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, newQty);
      await loadCart();
    } catch {}
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch {}
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code"); return; }
    const validCoupons = { WELCOME10: 0.1, SAVE20: 0.2 };
    if (validCoupons[code]) {
      setCouponDiscount(validCoupons[code]);
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponDiscount(0);
      setAppliedCoupon("");
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const discount = couponDiscount > 0 ? subtotal * couponDiscount : 0;
  const total = subtotal - discount;
  const shipping = subtotal > 140 || subtotal === 0 ? 0 : 9.99;

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar cartCount={cartCount} />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <nav className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          <Link to="/" className="hover:underline">Home</Link> / <span style={{ color: "var(--text-primary)" }}>Cart</span>
        </nav>

        {loading ? (
          <div className="text-center py-20 text-lg">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Your cart is empty</h2>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>Looks like you haven't added anything yet.</p>
            <Link to="/" className="px-8 py-3 rounded text-sm font-medium text-white" style={{ backgroundColor: "var(--accent-color)" }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 p-4 rounded-lg mb-4 font-medium text-sm" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                <div className="col-span-2">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Subtotal</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-lg mb-3 items-center" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                  <div className="col-span-2 flex items-center gap-4">
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700 text-lg" aria-label="Remove">✕</button>
                    <img src={item.product.img} alt={item.product.name} className="w-16 h-16 object-cover rounded" onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }} />
                    <div>
                      <Link to={`/product/${item.product.id}`} className="text-sm font-medium hover:text-blue-600" style={{ color: "var(--text-primary)" }}>{item.product.name}</Link>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.product.category}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium" style={{ color: "var(--text-primary)" }}>${item.product.price}</div>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded border text-lg flex items-center justify-center hover:bg-gray-100" style={{ borderColor: "var(--border-color)" }}>-</button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded border text-lg flex items-center justify-center hover:bg-gray-100" style={{ borderColor: "var(--border-color)" }}>+</button>
                  </div>
                  <div className="text-right text-sm font-semibold" style={{ color: "var(--accent-color)" }}>₹{(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              {/* Buttons */}
              <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
                <Link to="/" className="px-6 py-3 rounded border text-sm font-medium hover:opacity-80" style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  Return To Shop
                </Link>
                <button onClick={loadCart} className="px-6 py-3 rounded border text-sm font-medium hover:opacity-80" style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  Update Cart
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:w-[340px] flex-shrink-0">
              {/* Coupon */}
              <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Coupon Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: "var(--input-bg)", border: `1.5px solid ${couponError ? "#ef4444" : "var(--input-border)"}`, color: "var(--text-primary)" }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button onClick={handleApplyCoupon} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--accent-color)" }}>Apply</button>
                </div>
                {couponError && <p className="mt-1 text-xs text-red-500">{couponError}</p>}
                {appliedCoupon && <p className="mt-1 text-xs text-green-600">Coupon "{appliedCoupon}" applied!</p>}
                <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  Try: WELCOME10, SAVE20
                </div>
              </div>

              {/* Cart Total */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Cart Total</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                    <span className="font-medium" style={{ color: shipping === 0 ? "#16a34a" : "var(--text-primary)" }}>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between pb-3 text-green-600" style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <span>Discount ({appliedCoupon})</span>
                      <span className="font-medium">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2">
                    <span style={{ color: "var(--text-primary)" }}>Total</span>
                    <span style={{ color: "var(--accent-color)" }}>₹{(total + shipping).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Save cart items to pass to checkout via localStorage
                    localStorage.setItem("checkoutItems", JSON.stringify(items));
                    navigate("/checkout");
                  }}
                  className="w-full mt-6 py-3.5 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: "var(--accent-color)", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-color)"}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;