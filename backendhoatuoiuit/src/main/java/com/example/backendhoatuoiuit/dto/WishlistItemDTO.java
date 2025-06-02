package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WishlistItemDTO {
    private Integer id;
    private Integer wishlistId;
    private Integer customerId;
    private Integer productId;
    private String productName;
    private String imageUrl;
    private Double price;
    private LocalDateTime addedDate;

}
