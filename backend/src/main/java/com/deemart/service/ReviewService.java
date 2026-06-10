package com.deemart.service;

import com.deemart.entity.Product;
import com.deemart.entity.Review;
import com.deemart.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;

    public ReviewService(ReviewRepository reviewRepository, ProductService productService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review addReview(Long productId, String user, int rating, String text) {
        Product product = productService.getProductById(productId);
        Review review = new Review(product, user, rating, java.time.LocalDate.now().toString(), text);
        return reviewRepository.save(review);
    }
}