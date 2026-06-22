import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const team = [
  { name: "Sarah Johnson", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face" },
  { name: "Michael Chen", role: "CTO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" },
  { name: "Emily Rodriguez", role: "Design Lead", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&crop=face" },
  { name: "David Kim", role: "Marketing Head", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" },
];

const stats = [
  { value: "10.5k", label: "Sellers active on our site" },
  { value: "33k", label: "Monthly Product Sales" },
  { value: "45.5k", label: "Customers active on our site" },
  { value: "25k", label: "Annual gross sales" },
];

const AboutPage = () => {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
        {/* Breadcrumb */}
        <nav className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          <Link to="/" className="hover:underline">Home</Link> / <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>About</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/2">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
              Our Story
            </h1>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                Launched in 2025, DeeMart is South Asia's premier online shopping marketplace
                with an active presence in Bangladesh. Supported by a wide range of tailored marketing,
                data, and service solutions, DeeMart has 10,500 sellers and 300 brands and serves 3
                million customers across the region.
              </p>
              <p>
                DeeMart has more than 1 million products to offer, growing at a very fast rate.
                DeeMart offers a diverse assortment in categories ranging from consumer goods to
                electronics, fashion, and home & lifestyle products.
              </p>
              <p>
                Our mission is to provide a seamless, enjoyable shopping experience with
                competitive pricing, fast delivery, and exceptional customer service.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--accent-color)" }}>
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=500&fit=crop"
                alt="Our team working"
                className="w-full h-[400px] object-cover mix-blend-overlay opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-8 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1 cursor-default"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-12" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
            Why Choose DeeMart?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🚚", title: "Fast Delivery", desc: "Free delivery for orders over $140. Express options available." },
              { icon: "🛡️", title: "Secure Payments", desc: "Encrypted transactions with multiple payment methods." },
              { icon: "🎧", title: "24/7 Support", desc: "Dedicated customer support team available around the clock." },
              { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free return policy on all products." },
              { icon: "💰", title: "Best Prices", desc: "Competitive pricing with regular deals and discounts." },
              { icon: "⭐", title: "Quality Products", desc: "Carefully curated products from verified sellers." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl text-left" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;