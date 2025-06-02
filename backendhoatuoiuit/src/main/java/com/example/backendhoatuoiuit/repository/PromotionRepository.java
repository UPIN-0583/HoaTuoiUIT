package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

    @Query("SELECT pd.promotion FROM ProductDiscount pd " +
            "WHERE pd.product.id = :productId " +
            "AND pd.promotion.isActive = true " +
            "AND pd.promotion.startDate <= CURRENT_TIMESTAMP " +
            "AND pd.promotion.endDate >= CURRENT_TIMESTAMP")
    List<Promotion> findActivePromotionsByProductId(@Param("productId") Integer productId);
}
