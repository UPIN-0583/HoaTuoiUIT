package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogPostDTO {
    private Integer id;
    private String title;
    private String content;
    private String thumbnailUrl;
    private String author;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
