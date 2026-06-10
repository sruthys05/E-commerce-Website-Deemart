package com.deemart.controller;

import com.deemart.entity.Review;
import com.deemart.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<Review> addReview(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body) {
        String user = (String) body.get("user");
        int rating = Integer.parseInt(body.get("rating").toString());
        String text = (String) body.get("text");
        return ResponseEntity.ok(reviewService.addReview(productId, user, rating, text));
    }
}