package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProductId(Integer productId);
    List<Review> findByProductIdAndIsVerified(Integer productId, Boolean isVerified);
    List<Review> findByCustomerId(Integer customerId);
    List<Review> findByProductIdAndCustomerId(Integer productId, Integer customerId);

}
