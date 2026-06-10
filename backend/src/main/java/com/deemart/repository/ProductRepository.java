package com.deemart.repository;

import com.deemart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFlashSaleTrue();
    List<Product> findByBestSellingTrue();
    List<Product> findByFeaturedTrue();
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String keyword);
}