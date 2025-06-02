package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.ReviewDTO;
import com.example.backendhoatuoiuit.entity.Customer;
import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setCustomerId(review.getCustomer() != null ? review.getCustomer().getId() : null);
        dto.setProductId(review.getProduct() != null ? review.getProduct().getId() : null);
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setIsVerified(review.getIsVerified());
        dto.setCreatedAt(review.getCreatedAt());

        if (review.getCustomer() != null) {
            dto.setCustomerName(review.getCustomer().getName());
        }

        if (review.getProduct() != null) {
            dto.setProductName(review.getProduct().getName());
        }

        return dto;
    }

    public Review toEntity(ReviewDTO dto) {
        Review review = new Review();
        review.setId(dto.getId());
        if (dto.getCustomerId() != null) {
            Customer customer = new Customer();
            customer.setId(dto.getCustomerId());
            review.setCustomer(customer);
        }
        if (dto.getProductId() != null) {
            Product product = new Product();
            product.setId(dto.getProductId());
            review.setProduct(product);
        }
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setIsVerified(dto.getIsVerified() != null ? dto.getIsVerified() : false);
        return review;
    }
}
