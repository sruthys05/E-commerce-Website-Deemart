package com.deemart.service;

import com.deemart.entity.Product;
import com.deemart.entity.WishlistItem;
import com.deemart.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductService productService;

    public WishlistService(WishlistItemRepository wishlistItemRepository, ProductService productService) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productService = productService;
    }

    public List<WishlistItem> getWishlist(String sessionId) {
        return wishlistItemRepository.findBySessionId(sessionId);
    }

    public WishlistItem addToWishlist(String sessionId, Long productId) {
        var existing = wishlistItemRepository.findBySessionIdAndProductId(sessionId, productId);
        if (existing.isPresent()) {
            return existing.get();
        }
        Product product = productService.getProductById(productId);
        WishlistItem item = new WishlistItem(sessionId, product);
        return wishlistItemRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(Long wishlistItemId) {
        wishlistItemRepository.deleteById(wishlistItemId);
    }

    @Transactional
    public void removeByProductId(String sessionId, Long productId) {
        wishlistItemRepository.findBySessionIdAndProductId(sessionId, productId)
                .ifPresent(item -> wishlistItemRepository.deleteById(item.getId()));
    }

    public boolean isInWishlist(String sessionId, Long productId) {
        return wishlistItemRepository.findBySessionIdAndProductId(sessionId, productId).isPresent();
    }

    public int getWishlistCount(String sessionId) {
        return wishlistItemRepository.findBySessionId(sessionId).size();
    }
}