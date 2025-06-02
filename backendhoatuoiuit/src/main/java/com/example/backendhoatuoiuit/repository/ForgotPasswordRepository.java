package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, String> {
    Optional<ForgotPassword> findByEmail(String email);
} 