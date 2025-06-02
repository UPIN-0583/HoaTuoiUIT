package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.ProductFlower;
import com.example.backendhoatuoiuit.entity.ProductFlowerKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductFlowerRepository extends JpaRepository<ProductFlower, ProductFlowerKey> {
    List<ProductFlower> findByProductId(Integer productId);
    void deleteByProductId(Integer productId);
}
