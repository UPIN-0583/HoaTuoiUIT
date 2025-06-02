package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByPhone(String phone);
}
