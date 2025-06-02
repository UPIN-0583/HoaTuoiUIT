package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductViewDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountValue;   // KM nếu có, null nếu không
    private BigDecimal finalPrice;      // = price - discountValue
    private Double averageRating;
    private String imageUrl;
    private Boolean isActive;

    private Integer categoryId;
    private String categoryName;

    private List<String> flowerNames;
    private List<String> occasionNames;
    private Boolean isFavorited;
}
