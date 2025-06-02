package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.ReviewDTO;
import com.example.backendhoatuoiuit.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public List<ReviewDTO> getReviewsByProductId(@PathVariable Integer productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ReviewDTO createReview(@RequestBody ReviewDTO reviewDTO) {
        return reviewService.createReview(reviewDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public void deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ReviewDTO verifyReview(@PathVariable Integer id) {
        return reviewService.verifyReview(id);
    }

    @GetMapping("/product/{productId}/average-rating")
    public Double getAverageRating(@PathVariable Integer productId) {
        return reviewService.getAverageRatingByProductId(productId);
    }

    @GetMapping
    public List<ReviewDTO> filterReviews(@RequestParam(required = false) Integer productId,
                                         @RequestParam(required = false) Integer customerId) {
        return reviewService.filterReviews(productId, customerId);
    }
}