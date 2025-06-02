package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.BlogPostDTO;
import com.example.backendhoatuoiuit.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    @GetMapping("/active")
    public List<BlogPostDTO> getActivePosts() {
        return blogPostService.getActivePosts();
    }

    @GetMapping
    public List<BlogPostDTO> getAllPosts() {
        return blogPostService.getAllPosts();
    }

    @GetMapping("/{id}")
    public BlogPostDTO getPostById(@PathVariable Integer id) {
        return blogPostService.getPostById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public BlogPostDTO createPost(@RequestBody BlogPostDTO dto) {
        return blogPostService.createPost(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public BlogPostDTO updatePost(@PathVariable Integer id, @RequestBody BlogPostDTO dto) {
        return blogPostService.updatePost(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePost(@PathVariable Integer id) {
        blogPostService.deletePost(id);
    }
}
