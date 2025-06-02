package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Wishlist;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    Optional<Wishlist> findByCustomerId(Integer customerId);
}
