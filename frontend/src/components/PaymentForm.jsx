import { useState, useEffect, useCallback } from "react";

// Card brand detection
const getCardBrand = (number) => {
  const clean = number.replace(/\s/g, "");
  if (/^4/.test(clean)) return { name: "Visa", pattern: "visa", maxLen: 16, cvvLen: 3 };
  if (/^5[1-5]/.test(clean)) return { name: "MasterCard", pattern: "mastercard", maxLen: 16, cvvLen: 3 };
  if (/^3[47]/.test(clean)) return { name: "Amex", pattern: "amex", maxLen: 15, cvvLen: 4 };
  if (/^6(?:011|5)/.test(clean)) return { name: "Discover", pattern: "discover", maxLen: 16, cvvLen: 3 };
  return { name: "Card", pattern: "unknown", maxLen: 16, cvvLen: 3 };
};

// Luhn algorithm for card number validation
const isValidLuhn = (num) => {
  const digits = num.replace(/\s/g, "");
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  const groups = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.substring(i, i + 4));
  }
  return groups.join(" ").substring(0, 19);
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").substring(0, 4);
  if (digits.length > 2) return digits.substring(0, 2) + "/" + digits.substring(2);
  return digits;
};

const CardIcon = ({ brand }) => {
  const icons = {
    visa: (
      <svg viewBox="0 0 48 32" width="40" height="28">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">VISA</text>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 48 32" width="40" height="28">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <circle cx="18" cy="16" r="7" fill="#EB001B" />
        <circle cx="30" cy="16" r="7" fill="#F79E1B" opacity="0.8" />
      </svg>
    ),
    amex: (
      <svg viewBox="0 0 48 32" width="40" height="28">
        <rect width="48" height="32" rx="4" fill="#2E77BC" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AMEX</text>
      </svg>
    ),
    discover: (
      <svg viewBox="0 0 48 32" width="40" height="28">
        <rect width="48" height="32" rx="4" fill="#FF6000" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">DISCOVER</text>
      </svg>
    ),
    unknown: (
      <svg viewBox="0 0 48 32" width="40" height="28">
        <rect width="48" height="32" rx="4" fill="#94A3B8" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10">💳</text>
      </svg>
    ),
  };
  return icons[brand] || icons.unknown;
};

const PaymentForm = ({ onSubmit, processing, total = 0 }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [cardBrand, setCardBrand] = useState("unknown");

  useEffect(() => {
    const brand = getCardBrand(cardNumber);
    setCardBrand(brand.pattern);
  }, [cardNumber]);

  const validate = useCallback(() => {
    const errs = {};
    const brand = getCardBrand(cardNumber);
    const cleanNum = cardNumber.replace(/\s/g, "");

    if (!cardHolder.trim()) errs.cardHolder = "Cardholder name is required";
    if (!cleanNum) errs.cardNumber = "Card number is required";
    else if (!/^\d+$/.test(cleanNum)) errs.cardNumber = "Card number must contain only digits";
    else if (cleanNum.length < 13) errs.cardNumber = "Card number is too short";
    else if (cleanNum.length > brand.maxLen) errs.cardNumber = "Card number is too long";
    else if (!isValidLuhn(cleanNum)) errs.cardNumber = "Invalid card number";

    const expiryClean = expiry.replace("/", "");
    if (!expiryClean) errs.expiry = "Expiry date is required";
    else if (expiryClean.length < 4) errs.expiry = "Enter a valid expiry (MM/YY)";
    else {
      const month = parseInt(expiryClean.substring(0, 2), 10);
      const year = parseInt("20" + expiryClean.substring(2, 4), 10);
      const now = new Date();
      if (month < 1 || month > 12) errs.expiry = "Invalid month";
      else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
        errs.expiry = "Card has expired";
    }

    if (!cvv) errs.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(cvv)) errs.cvv = "CVV must be 3-4 digits";
    else if (cvv.length !== brand.cvvLen) errs.cvv = `CVV must be ${brand.cvvLen} digits for ${brand.name}`;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [cardHolder, cardNumber, expiry, cvv]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ cardNumber: true, cardHolder: true, expiry: true, cvv: true });
    if (!validate()) return;
    if (processing) return;

    const cleanNum = cardNumber.replace(/\s/g, "");
    const brand = getCardBrand(cleanNum);
    const maskedNum = cleanNum.slice(-4).padStart(cleanNum.length, "*");
    const expiryMonth = expiry.substring(0, 2);
    const expiryYear = "20" + expiry.substring(3, 5);

    await onSubmit({
      paymentInfo: "PAID",
      cardHolderName: cardHolder.trim(),
      cardType: brand.name,
      cardBrand: brand.pattern,
      last4: cleanNum.slice(-4),
      maskedNumber: maskedNum,
      expiryMonth,
      expiryYear,
      saveCard,
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 font-mono tracking-wider";
  const inputStyle = (field) => ({
    backgroundColor: "var(--input-bg)",
    border: `1.5px solid ${errors[field] && touched[field] ? "#ef4444" : "var(--input-border)"}`,
    color: "var(--text-primary)",
    fontFamily: "'Poppins', sans-serif",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Card Brand Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Accepted Cards
        </span>
        <div className="flex gap-2">
          {["visa", "mastercard", "amex", "discover"].map((b) => (
            <div key={b} className={`transition-all duration-200 ${cardBrand === b ? "opacity-100 scale-110" : "opacity-40 grayscale"}`}>
              <CardIcon brand={b} />
            </div>
          ))}
        </div>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
          Card Number *
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            onBlur={() => handleBlur("cardNumber")}
            className={`${inputBase} pl-4 pr-14`}
            style={inputStyle("cardNumber")}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            autoComplete="cc-number"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CardIcon brand={cardBrand} />
          </div>
        </div>
        {errors.cardNumber && touched.cardNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
          Cardholder Name *
        </label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
          onBlur={() => handleBlur("cardHolder")}
          className={inputBase}
          style={{ ...inputStyle("cardHolder"), fontFamily: "'Poppins', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
          placeholder="JOHN DOE"
          autoComplete="cc-name"
        />
        {errors.cardHolder && touched.cardHolder && (
          <p className="mt-1 text-xs text-red-500">{errors.cardHolder}</p>
        )}
      </div>

      {/* Expiry & CVV Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Expiry Date *
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            onBlur={() => handleBlur("expiry")}
            className={inputBase}
            style={inputStyle("expiry")}
            placeholder="MM/YY"
            maxLength={5}
            autoComplete="cc-exp"
          />
          {errors.expiry && touched.expiry && (
            <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            CVV *
          </label>
          <input
            type="password"
            inputMode="numeric"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
            onBlur={() => handleBlur("cvv")}
            className={inputBase}
            style={inputStyle("cvv")}
            placeholder="***"
            maxLength={4}
            autoComplete="cc-csc"
          />
          {errors.cvv && touched.cvv && (
            <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Save card toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          style={{ accentColor: "var(--accent-color)" }}
        />
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Save card for future purchases
        </span>
      </label>

      {/* Security Badge */}
      <div className="flex items-center gap-2 py-2.5 px-4 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Your payment info is encrypted and processed securely. No card details are stored.
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing}
        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          backgroundColor: processing ? "var(--accent-hover)" : "var(--accent-color)",
          boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
        }}
        onMouseEnter={(e) => {
          if (!processing) e.currentTarget.style.backgroundColor = "var(--accent-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--accent-color)";
        }}
      >
        {processing ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Pay Securely — ${total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;