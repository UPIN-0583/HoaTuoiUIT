package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.BlogPostDTO;
import com.example.backendhoatuoiuit.entity.BlogPost;
import org.springframework.stereotype.Component;

@Component
public class BlogPostMapper {

    public BlogPostDTO toDTO(BlogPost blogPost) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setContent(blogPost.getContent());
        dto.setThumbnailUrl(blogPost.getThumbnailUrl());
        dto.setAuthor(blogPost.getAuthor());
        dto.setCreatedAt(blogPost.getCreatedAt());
        dto.setUpdatedAt(blogPost.getUpdatedAt());
        dto.setIsActive(blogPost.getIsActive());
        dto.setTags(blogPost.getTags());
        return dto;
    }

    public BlogPost toEntity(BlogPostDTO dto) {
        BlogPost blogPost = new BlogPost();
        blogPost.setId(dto.getId());
        blogPost.setTitle(dto.getTitle());
        blogPost.setContent(dto.getContent());
        blogPost.setThumbnailUrl(dto.getThumbnailUrl());
        blogPost.setAuthor(dto.getAuthor());
        blogPost.setIsActive(dto.getIsActive());
        blogPost.setTags(dto.getTags());

        return blogPost;
    }
}
