package com.deemart.service;

import com.deemart.entity.CartItem;
import com.deemart.entity.Product;
import com.deemart.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }

    public List<CartItem> getCart(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }

    public CartItem addToCart(String sessionId, Long productId, int quantity) {
        Product product = productService.getProductById(productId);
        var existing = cartItemRepository.findBySessionIdAndProductId(sessionId, productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }
        CartItem cartItem = new CartItem(sessionId, product, quantity);
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateQuantity(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }

    public int getCartCount(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId).stream()
                .mapToInt(CartItem::getQuantity).sum();
    }
}