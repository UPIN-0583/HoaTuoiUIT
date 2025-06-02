package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.ProductDiscount;
import com.example.backendhoatuoiuit.entity.ProductDiscountKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductDiscountRepository extends JpaRepository<ProductDiscount, ProductDiscountKey> {
    List<ProductDiscount> findByProductId(Integer productId);
    void deleteByPromotionId(Integer promotionId);
}
