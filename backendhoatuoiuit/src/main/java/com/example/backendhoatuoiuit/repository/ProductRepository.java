package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Set;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    List<Product> findByIsFeaturedTrue();
    List<Product> findByIsActiveTrue();

    @Query("""
    SELECT p FROM Product p
    JOIN OrderProduct op ON op.product.id = p.id
    GROUP BY p.id
    ORDER BY SUM(op.quantity) DESC
    """)
    List<Product> findTopSellingProducts(Pageable pageable);

    @Query("""
    SELECT DISTINCT p FROM Product p
    LEFT JOIN p.occasions o
    WHERE p.id <> :productId
    AND (
        (:categoryId IS NOT NULL AND p.category.id = :categoryId)
        OR (o.id IN :occasionIds)
    )
    """)
    List<Product> findRelatedProducts(@Param("categoryId") Integer categoryId,
                                      @Param("occasionIds") Set<Integer> occasionIds,
                                      @Param("productId") Integer productId);

    @Query("""
    SELECT p FROM Product p
    JOIN ProductDiscount pd ON pd.product.id = p.id
    JOIN Promotion promo ON promo.id = pd.id.discountId
    WHERE promo.isActive = true
    ORDER BY promo.discountValue DESC
    """)
    List<Product> findMostDiscountedProducts(Pageable pageable);



    List<Product> findByCategoryId(Integer categoryId);

    @Query("SELECT p FROM Product p JOIN ProductFlower pf ON p.id = pf.product.id " +
            "JOIN Flower f ON pf.flower.id = f.id WHERE f.englishName = :englishName")
    List<Product> findByFlowerEnglishName(String englishName);
}
