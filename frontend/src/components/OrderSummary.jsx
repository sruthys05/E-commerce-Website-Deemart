import { Link } from "react-router-dom";

const OrderSummary = ({ items, subtotal, shipping, tax, discount, couponCode, onApplyCoupon, couponError }) => {
  const total = subtotal + shipping + tax - discount;

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
        Order Summary
      </h3>

      {/* Items */}
      {items.length > 0 && (
        <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id || item.productId} className="flex items-center gap-3">
              <img
                src={item.product?.img || item.img}
                alt={item.product?.name || item.name}
                className="w-12 h-12 rounded object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/48"; }}
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product?.id || item.productId}`} className="text-xs font-medium truncate block hover:text-blue-600" style={{ color: "var(--text-primary)" }}>
                  {item.product?.name || item.name}
                </Link>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                ${((item.product?.price || item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="h-px" style={{ backgroundColor: "var(--border-color)" }} />

      {/* Pricing Lines */}
      <div className="space-y-3 mt-4 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
          <span className="font-medium" style={{ color: shipping === 0 ? "#16a34a" : "var(--text-primary)" }}>
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--text-secondary)" }}>Tax</span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount {couponCode && `(${couponCode})`}</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="h-px my-4" style={{ backgroundColor: "var(--border-color)" }} />

      <div className="flex justify-between text-base font-bold mb-5" style={{ color: "var(--text-primary)" }}>
        <span>Total</span>
        <span style={{ color: "var(--accent-color)" }}>${total.toFixed(2)}</span>
      </div>

      {/* Coupon Code */}
      {onApplyCoupon && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              defaultValue={couponCode || ""}
              id="coupon-input"
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                border: `1.5px solid ${couponError ? "#ef4444" : "var(--input-border)"}`,
                color: "var(--text-primary)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onApplyCoupon(e.target.value);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById("coupon-input");
                onApplyCoupon(input?.value || "");
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--accent-color)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-color)"}
            >
              Apply
            </button>
          </div>
          {couponError && <p className="mt-1 text-xs text-red-500">{couponError}</p>}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;