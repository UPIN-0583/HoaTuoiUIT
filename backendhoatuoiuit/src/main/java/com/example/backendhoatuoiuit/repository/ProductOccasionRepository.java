package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.ProductOccasion;
import com.example.backendhoatuoiuit.entity.ProductOccasionKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductOccasionRepository extends JpaRepository<ProductOccasion, ProductOccasionKey> {
    List<ProductOccasion> findByProductId(Integer productId);
    void deleteByProductId(Integer productId);
}
