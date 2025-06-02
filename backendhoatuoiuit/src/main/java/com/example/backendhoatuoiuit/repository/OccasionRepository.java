package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Occasion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OccasionRepository extends JpaRepository<Occasion, Integer> {
    List<Occasion> findByIsActiveTrue();

}
