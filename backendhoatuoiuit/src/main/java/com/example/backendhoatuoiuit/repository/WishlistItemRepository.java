package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Integer> {
    Optional<WishlistItem> findByWishlistIdAndProductId(Integer wishlistId, Integer productId);
    void deleteById(Integer id);

    @Query("SELECT COUNT(wi) > 0 FROM WishlistItem wi " +
            "WHERE wi.wishlist.customer.id = :customerId AND wi.product.id = :productId")
    boolean existsByCustomerIdAndProductId(@Param("customerId") Integer customerId,
                                           @Param("productId") Integer productId);

    @Query("SELECT wi.product.id FROM WishlistItem wi WHERE wi.wishlist.customer.id = :customerId")
    List<Integer> findAllProductIdsInWishlist(@Param("customerId") Integer customerId);

    @Query("SELECT wi FROM WishlistItem wi WHERE wi.wishlist.customer.id = :customerId AND wi.product.id = :productId")
    Optional<WishlistItem> findByCustomerIdAndProductId(@Param("customerId") Integer customerId,
                                                        @Param("productId") Integer productId);

}
