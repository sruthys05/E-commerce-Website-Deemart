package com.deemart.controller;

import com.deemart.entity.WishlistItem;
import com.deemart.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(@RequestHeader("X-Session-Id") String sessionId) {
        return ResponseEntity.ok(wishlistService.getWishlist(sessionId));
    }

    @PostMapping
    public ResponseEntity<WishlistItem> addToWishlist(
            @RequestHeader("X-Session-Id") String sessionId,
            @RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(body.get("productId").toString());
        return ResponseEntity.ok(wishlistService.addToWishlist(sessionId, productId));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long itemId) {
        wishlistService.removeFromWishlist(itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> removeByProductId(
            @RequestHeader("X-Session-Id") String sessionId,
            @PathVariable Long productId) {
        wishlistService.removeByProductId(sessionId, productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(
            @RequestHeader("X-Session-Id") String sessionId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("inWishlist", wishlistService.isInWishlist(sessionId, productId)));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getWishlistCount(@RequestHeader("X-Session-Id") String sessionId) {
        return ResponseEntity.ok(Map.of("count", wishlistService.getWishlistCount(sessionId)));
    }
}