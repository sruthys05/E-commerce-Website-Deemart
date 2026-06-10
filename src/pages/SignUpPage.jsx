import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const inputStyle = (field) => ({
    backgroundColor: "var(--input-bg)",
    border: `1.5px solid ${errors[field] ? "var(--accent-color)" : "var(--input-border)"}`,
    color: "var(--text-primary)",
    fontFamily: "Poppins, sans-serif",
  });

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <main className="flex min-h-[calc(100vh-130px)]">
        {/* Left: Hero Panel */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-[#0f0f0f]">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(37,99,235,0.22) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(37,99,235,0.10) 0%, transparent 60%)" }} />
          <div className="relative z-10 text-center px-12">
            <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "rgba(37,99,235,0.18)", border: "2px solid rgba(37,99,235,0.35)" }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Inter, sans-serif" }}>Join Exclusive Today</h2>
            <p className="text-base mb-8" style={{ color: "#b0b0b0", fontFamily: "Poppins, sans-serif" }}>
              Get access to exclusive deals, flash sales, and personalised recommendations.
            </p>
            <div className="flex flex-col gap-4 text-left max-w-[320px] mx-auto">
              {[
                { icon: "🚀", text: "Free express delivery on first order" },
                { icon: "💰", text: "Up to 50% off seasonal sales" },
                { icon: "🎁", text: "Exclusive member-only discounts" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <span className="text-sm" style={{ color: "#d0d0d0", fontFamily: "Poppins, sans-serif" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--bg-primary)" }}>
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>Create Account</h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "Poppins, sans-serif" }}>Enter your details below to get started</p>
            </div>

            {submitted && (
              <div role="alert" className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-3" style={{ backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", color: "#16a34a", fontFamily: "Poppins, sans-serif" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                Account created! Redirecting you to the home page…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {["name", "email", "password"].map((field) => (
                <div className="mb-5" key={field}>
                  <label htmlFor={field} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)", fontFamily: "Poppins, sans-serif" }}>
                    {field === "name" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                    autoComplete={field === "name" ? "name" : field}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={field === "password" ? "Minimum 8 characters" : `Enter your ${field === "name" ? "full name" : field}`}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={inputStyle(field)}
                    onFocus={(e) => { e.target.style.borderColor = "var(--input-focus)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                    onBlur={(e) => { if (!errors[field]) { e.target.style.borderColor = "var(--input-border)"; e.target.style.boxShadow = "none"; }}}
                  />
                  {errors[field] && <p className="mt-1.5 text-xs" style={{ color: "var(--accent-color)", fontFamily: "Poppins, sans-serif" }}>{errors[field]}</p>}
                  {field === "password" && !errors.password && <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)", fontFamily: "Poppins, sans-serif" }}>Must be at least 8 characters long.</p>}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60"
                style={{
                  backgroundColor: "var(--accent-color)", color: "#fff", fontFamily: "Poppins, sans-serif",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
                onMouseEnter={(e) => { if (!submitted) e.currentTarget.style.backgroundColor = "var(--accent-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-color)"; }}
              >
                {submitted ? "Creating Account…" : "Create Account"}
              </button>

              <button
                type="button"
                className="w-full mt-3 py-3.5 rounded-lg text-sm font-medium flex items-center justify-center gap-3 transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-surface)", border: "1.5px solid var(--border-color)",
                  color: "var(--text-primary)", fontFamily: "Poppins, sans-serif",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)", fontFamily: "Poppins, sans-serif" }}>
                Already have an account?{" "}
                <Link to="/" className="font-semibold underline" style={{ color: "var(--accent-color)" }}>Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;