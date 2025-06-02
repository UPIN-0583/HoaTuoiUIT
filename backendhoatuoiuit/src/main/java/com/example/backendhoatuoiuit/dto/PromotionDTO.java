package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromotionDTO {
    private Integer id;
    private String code;
    private BigDecimal discountValue;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;

    private List<Integer> productIds; // danh sách id sản phẩm được áp dụng

}
