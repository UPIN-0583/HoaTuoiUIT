package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);

    @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cart.id = :cartId")
    Optional<Integer> sumQuantityByCartId(@Param("cartId") Integer cartId);


}
