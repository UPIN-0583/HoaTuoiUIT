package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CartItemDTO {
    private Integer id;
    private Integer cartId;
    private Integer productId;
    private String productName;
    private String imageUrl;
    private Double price;
    private LocalDateTime addedDate;
    private Integer quantity;
    private Double discountApplied;
    private Double priceAfterDiscount;
}
