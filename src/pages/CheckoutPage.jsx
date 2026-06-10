import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaymentForm from "../components/PaymentForm";
import OrderSummary from "../components/OrderSummary";
import { getCart, getCartCount, clearCart, createOrder } from "../api";

const VALID_COUPONS = {
  WELCOME10: { discount: 0.1, desc: "10% off your first order" },
  SAVE20: { discount: 0.2, desc: "20% off selected items" },
  FREESHIP: { discount: 0, desc: "Free shipping", freeShipping: true },
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=shipping, 2=payment
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [freeShipping, setFreeShipping] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [shippingErrors, setShippingErrors] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data || []);
      const cc = await getCartCount();
      setCartCount(cc?.count || 0);
    } catch {}
    setLoading(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shippingCost = freeShipping || subtotal > 140 ? 0 : 9.99;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const discount = couponDiscount > 0 ? subtotal * couponDiscount : 0;
  const total = subtotal + shippingCost + tax - discount;

  const validateShipping = () => {
    const errs = {};
    if (!shipping.firstName.trim()) errs.firstName = "Required";
    if (!shipping.lastName.trim()) errs.lastName = "Required";
    if (!shipping.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) errs.email = "Invalid email";
    if (!shipping.phone.trim()) errs.phone = "Required";
    if (!shipping.address.trim()) errs.address = "Required";
    if (!shipping.city.trim()) errs.city = "Required";
    if (!shipping.zip.trim()) errs.zip = "Required";
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) setStep(2);
  };

  const handlePaymentSubmit = async ({ paymentInfo } = { paymentInfo: "PAID" }) => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create order in backend (payment already confirmed; no card data)
      const createRes = await createOrder({
        subtotal,
        shipping: shippingCost,
        tax,
        discount,
        total,
        shippingAddress: JSON.stringify(shipping),
        paymentInfo: paymentInfo || "PAID",
      });

      // Clear cart
      try {
        await clearCart();
      } catch {}
      localStorage.removeItem("cart");

      const backendOrder = createRes || null;
      setOrderPlaced(true);
      navigate("/order-success", {
        state: {
          order:
            backendOrder || {
              id: "ORD-" + Date.now().toString(36).toUpperCase(),
              date: new Date().toISOString(),
              items: cartItems,
              shippingAddress: { ...shipping },
              payment: { paymentInfo: paymentInfo || "PAID" },
              subtotal,
              shipping: shippingCost,
              tax,
              discount,
              total,
              couponCode: couponCode || null,
              status: "confirmed",
            },
        },
      });
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };


  const handleApplyCoupon = (code) => {
    const upperCode = code.trim().toUpperCase();
    if (!upperCode) { setCouponError("Enter a coupon code"); return; }
    const coupon = VALID_COUPONS[upperCode];
    if (!coupon) { setCouponError("Invalid coupon code"); setCouponDiscount(0); setFreeShipping(false); setCouponCode(""); return; }
    setCouponError("");
    setCouponCode(upperCode);
    setCouponDiscount(coupon.discount || 0);
    if (coupon.freeShipping) setFreeShipping(true);
  };

  const handleShippingChange = (field, value) => {
    setShipping((p) => ({ ...p, [field]: value }));
    if (shippingErrors[field]) setShippingErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const inputBase = "w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200";
  const inputStyle = (field) => ({
    backgroundColor: "var(--input-bg)",
    border: `1.5px solid ${shippingErrors[field] ? "#ef4444" : "var(--input-border)"}`,
    color: "var(--text-primary)",
    fontFamily: "Poppins, sans-serif",
  });

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar cartCount={cartCount} />
        <div className="text-center py-20 text-lg">Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar cartCount={cartCount} />
        <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Your cart is empty</h2>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>Add some products before checking out.</p>
          <Link to="/" className="px-8 py-3 rounded text-sm font-medium text-white" style={{ backgroundColor: "var(--accent-color)" }}>
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar cartCount={cartCount} />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          <Link to="/" className="hover:underline">Home</Link> /{" "}
          <Link to="/cart" className="hover:underline">Cart</Link> /{" "}
          <span style={{ color: "var(--text-primary)" }}>Checkout</span>
        </nav>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {[
            { num: 1, label: "Shipping" },
            { num: 2, label: "Payment" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  backgroundColor: step >= s.num ? "var(--accent-color)" : "var(--bg-secondary)",
                  color: step >= s.num ? "#fff" : "var(--text-muted)",
                }}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="text-sm font-medium" style={{ color: step >= s.num ? "var(--text-primary)" : "var(--text-muted)" }}>
                {s.label}
              </span>
              {s.num < 2 && <div className="w-12 h-px" style={{ backgroundColor: "var(--border-color)" }} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Forms */}
          <div className="flex-1 lg:w-2/3">
            {step === 1 ? (
              /* Shipping Form */
              <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
                  Shipping Address
                </h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>First Name *</label>
                      <input type="text" value={shipping.firstName} onChange={(e) => handleShippingChange("firstName", e.target.value)} className={inputBase} style={inputStyle("firstName")} placeholder="John" />
                      {shippingErrors.firstName && <p className="mt-1 text-xs text-red-500">{shippingErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Last Name *</label>
                      <input type="text" value={shipping.lastName} onChange={(e) => handleShippingChange("lastName", e.target.value)} className={inputBase} style={inputStyle("lastName")} placeholder="Doe" />
                      {shippingErrors.lastName && <p className="mt-1 text-xs text-red-500">{shippingErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Email *</label>
                      <input type="email" value={shipping.email} onChange={(e) => handleShippingChange("email", e.target.value)} className={inputBase} style={inputStyle("email")} placeholder="john@example.com" />
                      {shippingErrors.email && <p className="mt-1 text-xs text-red-500">{shippingErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Phone *</label>
                      <input type="tel" value={shipping.phone} onChange={(e) => handleShippingChange("phone", e.target.value)} className={inputBase} style={inputStyle("phone")} placeholder="+1 (555) 000-0000" />
                      {shippingErrors.phone && <p className="mt-1 text-xs text-red-500">{shippingErrors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Address *</label>
                    <input type="text" value={shipping.address} onChange={(e) => handleShippingChange("address", e.target.value)} className={inputBase} style={inputStyle("address")} placeholder="123 Main Street, Apt 4B" />
                    {shippingErrors.address && <p className="mt-1 text-xs text-red-500">{shippingErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>City *</label>
                      <input type="text" value={shipping.city} onChange={(e) => handleShippingChange("city", e.target.value)} className={inputBase} style={inputStyle("city")} placeholder="New York" />
                      {shippingErrors.city && <p className="mt-1 text-xs text-red-500">{shippingErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>State</label>
                      <input type="text" value={shipping.state} onChange={(e) => handleShippingChange("state", e.target.value)} className={inputBase} style={inputStyle("state")} placeholder="NY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>ZIP Code *</label>
                      <input type="text" value={shipping.zip} onChange={(e) => handleShippingChange("zip", e.target.value)} className={inputBase} style={inputStyle("zip")} placeholder="10001" />
                      {shippingErrors.zip && <p className="mt-1 text-xs text-red-500">{shippingErrors.zip}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link to="/cart" className="text-sm hover:underline" style={{ color: "var(--accent-color)" }}>← Back to Cart</Link>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all"
                      style={{ backgroundColor: "var(--accent-color)", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-hover)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-color)"}
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Payment Form */
              <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
                  Payment Details
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  Securely pay with your credit/debit card
                </p>
                <PaymentForm onSubmit={handlePaymentSubmit} processing={processing} />
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-sm hover:underline"
                  style={{ color: "var(--accent-color)" }}
                >
                  ← Back to Shipping
                </button>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shippingCost}
                tax={tax}
                discount={discount}
                couponCode={couponCode}
                onApplyCoupon={handleApplyCoupon}
                couponError={couponError}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
