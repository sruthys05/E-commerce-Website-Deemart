import { useState } from "react";

const PaymentForm = ({ onSubmit, processing }) => {
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing || busy) return;
    setBusy(true);
    try {
      // No card details needed; backend just records payment as received.
      await onSubmit({ paymentInfo: "PAID" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="submit"
        disabled={processing || busy}
        className="w-full py-3.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
        style={{
          backgroundColor: "var(--accent-color)",
          boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
        }}
        onMouseEnter={(e) => {
          if (!processing && !busy) e.currentTarget.style.backgroundColor = "var(--accent-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--accent-color)";
        }}
      >
        {processing || busy ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing Payment...
          </span>
        ) : (
          "Pay Securely"
        )}
      </button>

      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        ✅ Payment confirmation only (no card details)
      </p>
    </form>
  );
};

export default PaymentForm;


