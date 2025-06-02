package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Integer id;
    private Integer customerId;
    private Integer productId;
    private Integer rating;
    private String comment;
    private Boolean isVerified;
    private String customerName;
    private String productName;
    private LocalDateTime createdAt;

}
