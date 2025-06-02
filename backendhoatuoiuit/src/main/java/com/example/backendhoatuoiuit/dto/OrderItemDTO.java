package com.example.backendhoatuoiuit.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class OrderItemDTO {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;              // Giá gốc
    private BigDecimal discountApplied;    // Số tiền đã giảm
    private BigDecimal priceAfterDiscount; // Giá cuối cùng
}
