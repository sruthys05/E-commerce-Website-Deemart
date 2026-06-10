package com.deemart.service;

import com.deemart.entity.Product;
import com.deemart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> getFlashSales() {
        List<Product> products = productRepository.findByFlashSaleTrue();
        if (products.isEmpty()) {
            // Return first 5 if none flagged
            return productRepository.findAll().stream().limit(5).toList();
        }
        return products;
    }

    public List<Product> getBestSelling() {
        List<Product> products = productRepository.findByBestSellingTrue();
        if (products.isEmpty()) {
            return productRepository.findAll().stream().skip(5).limit(4).toList();
        }
        return products;
    }

    public List<Product> getFeatured() {
        List<Product> products = productRepository.findByFeaturedTrue();
        if (products.isEmpty()) {
            return productRepository.findAll().stream().skip(9).limit(8).toList();
        }
        return products;
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }
}