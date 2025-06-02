package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Integer categoryId;
    private String categoryName;
    private Boolean isActive;
    private Boolean isFeatured;

    private List<Integer> flowerIds;
    private List<Integer> occasionIds;
    private List<String> occasionNames;
    private List<String> flowerNames;

}
