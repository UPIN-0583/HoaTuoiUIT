package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Integer> {
    List<OrderProduct> findByOrderId(Integer orderId);
    @Query("SELECT SUM(op.quantity * (op.price - op.discountApplied)) FROM OrderProduct op WHERE op.order.id = :orderId")
    BigDecimal calculateTotalAmountByOrderId(@Param("orderId") Integer orderId);

}
