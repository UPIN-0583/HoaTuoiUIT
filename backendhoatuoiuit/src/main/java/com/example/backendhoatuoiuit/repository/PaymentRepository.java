package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
