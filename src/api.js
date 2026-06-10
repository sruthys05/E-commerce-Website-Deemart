import { localData } from "./data";

const API_BASE = "http://localhost:8080/api";

function getSessionId() {
  let id = localStorage.getItem("sessionId");
  if (!id) {
    id = "sess_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("sessionId", id);
  }
  return id;
}

// Tries backend first, falls back to local data silently
async function tryAPI(url, options = {}, localFn) {
  try {
    const headers = {
      "X-Session-Id": getSessionId(),
      "Content-Type": "application/json",
      ...options.headers,
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    // Backend not available - use local data
    return localFn ? localFn() : null;
  }
}

// Products
export const getProducts = () => tryAPI("/products", {}, () => localData.products);
export const getProduct = (id) => tryAPI(`/products/${id}`, {}, () => localData.getProduct(id));
export const getFlashSales = () => tryAPI("/products/flash-sales", {}, () => localData.getFlashSales());
export const getBestSelling = () => tryAPI("/products/best-selling", {}, () => localData.getBestSelling());
export const getFeatured = () => tryAPI("/products/featured", {}, () => localData.getFeatured());
export const searchProducts = (q) => tryAPI(`/products/search?q=${encodeURIComponent(q)}`, {}, () => localData.search(q));
export const getProductReviews = (productId) => tryAPI(`/products/${productId}/reviews`, {}, () => localData.getProductReviews(productId));
export const getRelatedProducts = (productId) => tryAPI(`/products/${productId}/related`, {}, () => localData.getRelatedProducts(productId));

// Cart
export const getCart = () => tryAPI("/cart", {}, () => localData.getCart());
export const getCartCount = () => tryAPI("/cart/count", {}, () => ({ count: localData.getCartCount() }));
export const addToCartAPI = (productId, quantity = 1) =>
  tryAPI("/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) }, () => { localData.addToCart(productId, quantity); return true; });
export const updateCartItem = (itemId, quantity) =>
  tryAPI(`/cart/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) }, () => { localData.updateCartItem(itemId, quantity); return true; });
export const removeFromCart = (itemId) =>
  tryAPI(`/cart/${itemId}`, { method: "DELETE" }, () => { localData.removeFromCart(itemId); return true; });
export const clearCart = () =>
  tryAPI("/cart", { method: "DELETE" }, () => { localStorage.removeItem("cart"); return true; });

// Orders
export const createOrder = (payload) =>
  tryAPI(
    "/orders",
    { method: "POST", body: JSON.stringify(payload) },
    () => ({})
  );

// Wishlist
export const getWishlist = () => tryAPI("/wishlist", {}, () => localData.getWishlist());

export const getWishlistCount = () => tryAPI("/wishlist/count", {}, () => ({ count: localData.getWishlistCount() }));
export const addToWishlistAPI = (productId) =>
  tryAPI("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }, () => { localData.toggleWishlist(productId); return true; });
export const removeFromWishlist = (itemId) =>
  tryAPI(`/wishlist/${itemId}`, { method: "DELETE" }, () => { const w = localData.getWishlist().filter(i => i.id !== itemId); localStorage.setItem("wishlist", JSON.stringify(w.map(i => i.product.id))); return true; });
export const removeFromWishlistByProduct = (productId) =>
  tryAPI(`/wishlist/product/${productId}`, { method: "DELETE" }, () => { localData.toggleWishlist(productId); return true; });
export const checkWishlist = (productId) =>
  tryAPI(`/wishlist/check/${productId}`, {}, () => ({ inWishlist: localData.isInWishlist(Number(productId)) }));

