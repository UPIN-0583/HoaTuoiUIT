package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByIsActiveTrue();
}
