import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // Try to get latest order from localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      if (orders.length > 0) setOrder(orders[0]);
      else navigate("/");
    }
  }, [location, navigate]);

  // Auto-redirect countdown
  useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [order, navigate]);

  if (!order) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-16">
        {/* Success Animation */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
            Order Confirmed! 🎉
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details Card */}
        <div
          className="rounded-xl overflow-hidden mb-8"
          style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}
        >
          {/* Header */}
          <div className="px-6 py-4" style={{ backgroundColor: "var(--accent-color)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm text-white/70">Order Number</p>
                <p className="text-white font-bold text-lg font-mono">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">Order Date</p>
                <p className="text-white font-medium text-sm">{formatDate(order.date)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="space-y-3 mb-5">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.product?.img}
                    alt={item.product?.name}
                    className="w-14 h-14 rounded-lg object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/56"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/₹{item.product?.id}`} className="text-sm font-medium truncate block hover:text-blue-600" style={{ color: "var(--text-primary)" }}>
                      {item.product?.name}
                    </Link>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity} × ₹{item.product?.price}</p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px" style={{ backgroundColor: "var(--border-color)" }} />

            {/* Pricing */}
            <div className="space-y-2 mt-4 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span style={{ color: "var(--text-primary)" }}>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                <span style={{ color: "var(--text-primary)" }}>{order.shipping === 0 ? "FREE" : `$${order.shipping?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Tax</span>
                <span style={{ color: "var(--text-primary)" }}>₹{order.tax?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px" style={{ backgroundColor: "var(--border-color)" }} />
              <div className="flex justify-between text-base font-bold">
                <span style={{ color: "var(--text-primary)" }}>Total</span>
                <span style={{ color: "var(--accent-color)" }}>₹{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.shippingAddress && (
            <div className="px-6 py-4 border-t" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Shipping To</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                {order.shippingAddress.email} | {order.shippingAddress.phone}
              </p>
            </div>
          )}

          {/* Payment Info */}
          <div className="px-6 py-4 border-t" style={{ borderColor: "var(--border-color)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Payment</h3>
            <div className="flex items-center gap-3">
              {/* Card brand icon */}
              <div className="w-10 h-7 rounded flex items-center justify-center text-[8px] font-bold text-white"
                style={{
                  backgroundColor:
                    order.payment?.cardBrand === "visa" ? "#1A1F71" :
                    order.payment?.cardBrand === "mastercard" ? "#1A1F71" :
                    order.payment?.cardBrand === "amex" ? "#2E77BC" :
                    order.payment?.cardBrand === "discover" ? "#FF6000" : "#94A3B8"
                }}
              >
                {order.payment?.cardBrand === "visa" ? "VISA" :
                 order.payment?.cardBrand === "mastercard" ? "MC" :
                 order.payment?.cardBrand === "amex" ? "AMEX" :
                 order.payment?.cardBrand === "discover" ? "DISC" : "💳"}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {order.payment?.cardType || "Card"} ending in <span className="font-mono tracking-wider">•••• {order.payment?.last4 || "0000"}</span>
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Expires {order.payment?.expiryMonth || "**"}/{order.payment?.expiryYear?.slice(2) || "**"}
                  {order.payment?.cardHolderName && <span> | {order.payment.cardHolderName}</span>}
                </p>
              </div>
            </div>
            {order.payment?.transactionId && (
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Transaction ID: <span className="font-mono">{order.payment.transactionId}</span>
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-xs font-medium text-green-600">
                Payment {order.status === "confirmed" ? "confirmed" : "completed"}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 rounded-lg text-sm font-semibold text-white text-center transition-all"
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-color)"}
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-8 py-3 rounded-lg text-sm font-medium text-center transition-all"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
          >
            View My Orders
          </Link>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Redirecting to home in {countdown} seconds...
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;