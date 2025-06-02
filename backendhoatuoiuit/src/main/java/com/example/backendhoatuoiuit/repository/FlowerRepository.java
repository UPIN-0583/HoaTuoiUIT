package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.Flower;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlowerRepository extends JpaRepository<Flower, Integer> {
    List<Flower> findByIsActiveTrue();
    Flower findByEnglishName(String englishName);
}
