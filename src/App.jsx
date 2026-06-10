import { Routes, Route, useNavigationType, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import ECommerceHomePage from "./pages/ECommerceHomePage";
import SignUpPage from "./pages/SignUpPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

const pageTitles = {
  "/": { title: "DeeMart – Online Shopping", description: "Shop the best deals on electronics, fashion, and more." },
  "/signup": { title: "Sign Up – DeeMart", description: "Create your DeeMart account." },
  "/contact": { title: "Contact Us – DeeMart", description: "Get in touch with the DeeMart support team." },
  "/about": { title: "About – DeeMart", description: "Learn more about DeeMart." },
  "/cart": { title: "Cart – DeeMart", description: "View your shopping cart." },
  "/wishlist": { title: "Wishlist – DeeMart", description: "View your wishlist." },
  "/checkout": { title: "Checkout – DeeMart", description: "Complete your purchase." },
  "/order-success": { title: "Order Placed – DeeMart", description: "Your order has been placed successfully." },
};

function AppRoutes() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") window.scrollTo(0, 0);
  }, [action, pathname]);

  useEffect(() => {
    const basePath = "/" + pathname.split("/")[1];
    const page = pageTitles[basePath] || pageTitles["/"];
    if (page) {
      document.title = page.title;
      const meta = document.querySelector('head > meta[name="description"]');
      if (meta) meta.content = page.description;
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<ECommerceHomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;