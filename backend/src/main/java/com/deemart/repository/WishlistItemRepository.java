package com.deemart.repository;

import com.deemart.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findBySessionId(String sessionId);
    Optional<WishlistItem> findBySessionIdAndProductId(String sessionId, Long productId);
    void deleteBySessionId(String sessionId);
}