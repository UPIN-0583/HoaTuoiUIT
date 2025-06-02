package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderProductDTO {
    private Integer id;
    private Integer orderId;
    private Integer productId;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal discountApplied;
}
