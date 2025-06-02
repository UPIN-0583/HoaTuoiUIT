package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.ReviewDTO;
import com.example.backendhoatuoiuit.entity.Review;
import com.example.backendhoatuoiuit.mapper.ReviewMapper;
import com.example.backendhoatuoiuit.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewMapper reviewMapper;

    public List<ReviewDTO> getReviewsByProductId(Integer productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream().map(reviewMapper::toDTO).collect(Collectors.toList());
    }

    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        Review review = reviewMapper.toEntity(reviewDTO);
        review = reviewRepository.save(review);
        return reviewMapper.toDTO(review);
    }

    public void deleteReview(Integer id) {
        reviewRepository.deleteById(id);
    }

    public ReviewDTO verifyReview(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setIsVerified(true);
        review = reviewRepository.save(review);

        return reviewMapper.toDTO(review);
    }

    public Double getAverageRatingByProductId(Integer productId) {
        List<Review> reviews = reviewRepository.findByProductIdAndIsVerified(productId, true);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        return average;
    }

    public List<ReviewDTO> filterReviews(Integer productId, Integer customerId) {
        List<Review> reviews;

        if (productId != null && customerId != null) {
            reviews = reviewRepository.findByProductIdAndCustomerId(productId, customerId);
        } else if (productId != null) {
            reviews = reviewRepository.findByProductId(productId);
        } else if (customerId != null) {
            reviews = reviewRepository.findByCustomerId(customerId);
        } else {
            reviews = reviewRepository.findAll();
        }

        return reviews.stream().map(reviewMapper::toDTO).collect(Collectors.toList());
    }


}
