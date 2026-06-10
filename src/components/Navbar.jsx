import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ cartCount = 0, wishlistCount = 0, onSearch, searchQuery, setSearchQuery }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Scroll hide/show behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 10);
      setVisible(currentScroll < lastScroll || currentScroll < 100);
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Contact", to: "/contact" },
    { label: "About", to: "/about" },
    { label: "Sign Up", to: "/signup" },
  ];

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { setMenuOpen(false); hamburgerRef.current?.focus(); }
  }, []);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <div className="w-full py-2.5 px-4 text-center text-xs sm:text-sm" style={{ backgroundColor: "var(--bg-topbar)", color: "var(--text-on-dark)" }} role="banner">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
        <a href="#shop" className="font-semibold underline ml-1 hover:opacity-80">ShopNow</a>
      </div>

      <header className="w-full sticky top-0 z-50" style={{ backgroundColor: "var(--bg-navbar)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] h-[70px] flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" aria-label="Exclusive - Home" className="flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>Dee Mart</span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} aria-current={isActive(to) ? "page" : undefined}
                className="relative text-sm font-medium py-1 focus:outline-none focus:ring-2 rounded"
                style={{ color: isActive(to) ? "var(--text-primary)" : "var(--text-secondary)", fontFamily: "Poppins, sans-serif" }}>
                {label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-transform duration-200 origin-left"
                  style={{ backgroundColor: "var(--accent-color)", transform: isActive(to) ? "scaleX(1)" : "scaleX(0)" }} aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <form onSubmit={onSearch} className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 text-sm" style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--border-color)" }}>
              <input
                type="search" placeholder="Search products..." value={searchQuery || ""}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                aria-label="Search products"
                className="bg-transparent outline-none text-xs w-28 lg:w-40" style={{ color: "var(--text-primary)", fontFamily: "Poppins, sans-serif" }}
              />
              <button type="submit" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" aria-label={`Wishlist, ${wishlistCount || 0} items`} className="relative p-2 rounded-full focus:outline-none focus:ring-2" style={{ color: "var(--text-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}>{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" aria-label={`Cart, ${cartCount || 0} items`} className="relative p-2 rounded-full focus:outline-none focus:ring-2" style={{ color: "var(--text-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}>{cartCount}</span>}
            </Link>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="relative w-11 h-6 rounded-full focus:outline-none focus:ring-2 flex-shrink-0"
              style={{ backgroundColor: theme === "dark" ? "var(--accent-color)" : "var(--border-color)" }}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 bg-white"
                style={{ transform: theme === "dark" ? "translateX(20px)" : "translateX(0)" }} aria-hidden="true">
                {theme === "dark" ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1a1a1a" }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f59e0b" }}>
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>

            {/* Hamburger */}
            <button ref={hamburgerRef} onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu"
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2" style={{ color: "var(--text-primary)" }}>
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" ref={menuRef} role="dialog" aria-label="Mobile navigation" aria-modal="true" aria-hidden={!menuOpen} onKeyDown={handleKeyDown}
          className="md:hidden w-full overflow-hidden" style={{ backgroundColor: "var(--bg-navbar)", borderTop: "1px solid var(--border-color)", maxHeight: menuOpen ? "500px" : "0", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
          <nav className="flex flex-col px-6 py-4 gap-1">
            <form onSubmit={onSearch} className="flex items-center gap-2 rounded-full px-4 py-2 mb-3" style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--border-color)" }}>
              <input type="search" placeholder="Search products..." value={searchQuery || ""} onChange={(e) => setSearchQuery?.(e.target.value)} aria-label="Search"
                className="bg-transparent outline-none text-sm flex-1" style={{ color: "var(--text-primary)", fontFamily: "Poppins, sans-serif" }} />
              <button type="submit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg></button>
            </form>
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} tabIndex={menuOpen ? 0 : -1} aria-current={isActive(to) ? "page" : undefined}
                className="py-3 px-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: isActive(to) ? "var(--accent-color)" : "var(--text-primary)", backgroundColor: isActive(to) ? "var(--bg-secondary)" : "transparent", fontFamily: "Poppins, sans-serif", borderLeft: isActive(to) ? "3px solid var(--accent-color)" : "3px solid transparent" }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;