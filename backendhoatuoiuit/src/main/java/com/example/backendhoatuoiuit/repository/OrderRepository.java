package com.example.backendhoatuoiuit.repository;


import com.example.backendhoatuoiuit.entity.Order;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE DATE(o.orderDate) = :orderDate AND o.status <> 'CANCELLED'")
    BigDecimal getTotalRevenueByDate(@Param("orderDate") LocalDate orderDate);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE FUNCTION('MONTH', o.orderDate) = :month AND FUNCTION('YEAR', o.orderDate) = :year AND o.status <> 'CANCELLED'")
    BigDecimal getTotalRevenueByMonth(@Param("month") int month, @Param("year") int year);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findTopByOrderByCreatedAtDesc(Pageable pageable);

    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    List<Order> findByCustomerId(Integer customerId);



}
