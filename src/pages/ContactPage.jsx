import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Your name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errs.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm" style={{ fontFamily: "Poppins, sans-serif", color: "var(--text-muted)" }}>
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Home</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-primary)", fontWeight: 500 }}>Contact</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Contact Info */}
          <aside className="lg:w-[320px] flex-shrink-0">
            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--accent-color)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.06 6.06l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Call To Us</h3>
              <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>We are available 24/7, 7 days a week.</p>
              <a href="tel:+88015888889999" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Phone: +88015-88888-9999</a>
            </div>
            <div className="h-px mb-6" style={{ backgroundColor: "var(--border-color)" }} />
            <div className="rounded-xl p-6" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--accent-color)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Write To Us</h3>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Fill out our form and we will contact you within 24 hours.</p>
              <div className="flex flex-col gap-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                <a href="mailto:customer@exclusive.com" className="hover:underline">customer@exclusive.com</a>
                <a href="mailto:support@exclusive.com" className="hover:underline">support@exclusive.com</a>
              </div>
            </div>
          </aside>

          {/* Right: Contact Form */}
          <div className="flex-1">
            <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>Get In Touch</h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Have a question or feedback? We'd love to hear from you.</p>

              {submitted && (
                <div role="alert" className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-3" style={{ backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", color: "#16a34a" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                  Your message has been sent! We'll get back to you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {["name", "email", "phone"].map((field) => (
                    <div key={field}>
                      <label htmlFor={`contact-${field}`} className="sr-only">{field}</label>
                      <input
                        id={`contact-${field}`}
                        type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}${field !== "phone" ? " *" : ""}`}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                        style={{
                          backgroundColor: "var(--input-bg)",
                          border: `1.5px solid ${errors[field] ? "var(--accent-color)" : "var(--input-border)"}`,
                          color: "var(--text-primary)",
                          fontFamily: "Poppins, sans-serif",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--input-focus)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                        onBlur={(e) => { if (!errors[field]) { e.target.style.borderColor = "var(--input-border)"; e.target.style.boxShadow = "none"; }}}
                      />
                      {errors[field] && <p className="mt-1 text-xs" style={{ color: "var(--accent-color)" }}>{errors[field]}</p>}
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Your Message *"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-none"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      border: `1.5px solid ${errors.message ? "var(--accent-color)" : "var(--input-border)"}`,
                      color: "var(--text-primary)",
                      fontFamily: "Poppins, sans-serif",
                      minHeight: "160px",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--input-focus)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                    onBlur={(e) => { if (!errors.message) { e.target.style.borderColor = "var(--input-border)"; e.target.style.boxShadow = "none"; }}}
                  />
                  {errors.message && <p className="mt-1 text-xs" style={{ color: "var(--accent-color)" }}>{errors.message}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending || submitted}
                    className="px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                    }}
                    onMouseEnter={(e) => { if (!sending && !submitted) e.currentTarget.style.backgroundColor = "var(--accent-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-color)"; }}
                  >
                    {sending ? "Sending…" : submitted ? "Message Sent!" : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;