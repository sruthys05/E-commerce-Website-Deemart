import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="w-full bg-[#1a2233] text-[#fafafa]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[135px] py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* DeeMart + Subscribe */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Inter, sans-serif" }}>DeeMart</h3>
            <p className="text-sm font-medium mb-4">Subscribe</p>
            <p className="text-xs mb-4 opacity-70">Get 10% off your first order</p>
            <div className="flex border border-white/30 rounded overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent px-3 py-2 text-xs flex-1 outline-none text-white placeholder-white/50"
              />
              <button className="px-3 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-6">Support</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li>111 abc city, abc, DH 1515, india.</li>
              <li>connectdeemart@gmail.com</li>
              <li>+91 123456789</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-medium mb-6">Account</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li><Link to="/" className="hover:underline">My Account</Link></li>
              <li><Link to="/signup" className="hover:underline">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:underline">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
              <li><Link to="/" className="hover:underline">Shop</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h3 className="text-lg font-medium mb-6">Quick Link</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms Of Use</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-lg font-medium mb-6">Download App</h3>
            <p className="text-xs opacity-70 mb-3">Save $3 with App New User Only</p>
            <div className="flex gap-2 mb-4">
              <div className="w-20 h-20 rounded bg-white/10 flex items-center justify-center text-3xl">📱</div>
              <div className="flex flex-col gap-1">
                <div className="w-[110px] h-10 rounded bg-white/10 flex items-center justify-center text-xs">Google Play</div>
                <div className="w-[110px] h-10 rounded bg-white/10 flex items-center justify-center text-xs">App Store</div>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
              <a href="#" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs opacity-40">
          &copy; Copyright DeeMart 2025. All right reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;