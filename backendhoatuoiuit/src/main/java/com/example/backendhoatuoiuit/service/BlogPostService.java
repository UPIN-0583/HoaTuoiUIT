package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.BlogPostDTO;
import com.example.backendhoatuoiuit.entity.BlogPost;
import com.example.backendhoatuoiuit.mapper.BlogPostMapper;
import com.example.backendhoatuoiuit.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogPostMapper blogPostMapper;

    public List<BlogPostDTO> getAllPosts() {
        return blogPostRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(blogPostMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BlogPostDTO> getActivePosts() {
        return blogPostRepository.findByIsActiveTrue()
                .stream()
                .map(blogPostMapper::toDTO)
                .collect(Collectors.toList());
    }

    public BlogPostDTO getPostById(Integer id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        return blogPostMapper.toDTO(post);
    }

    public BlogPostDTO createPost(BlogPostDTO dto) {
        BlogPost post = blogPostMapper.toEntity(dto);
        post = blogPostRepository.save(post);
        return blogPostMapper.toDTO(post);
    }

    public BlogPostDTO updatePost(Integer id, BlogPostDTO dto) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setThumbnailUrl(dto.getThumbnailUrl());
        post.setAuthor(dto.getAuthor());
        post.setIsActive(dto.getIsActive());
        post.setTags(dto.getTags());
        post = blogPostRepository.save(post);
        return blogPostMapper.toDTO(post);
    }

    public void deletePost(Integer id) {
        blogPostRepository.deleteById(id);
    }
}
