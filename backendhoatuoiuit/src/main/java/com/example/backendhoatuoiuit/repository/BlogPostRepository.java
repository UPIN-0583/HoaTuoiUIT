package com.example.backendhoatuoiuit.repository;

import com.example.backendhoatuoiuit.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {
    List<BlogPost> findByIsActiveTrue();
}
