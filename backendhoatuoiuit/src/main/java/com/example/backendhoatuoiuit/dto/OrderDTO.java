package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Integer id;
    private Integer customerId;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private String deliveryAddress;
    private BigDecimal totalAmount;
    private String status;
    private Integer paymentId;
    private String note;
    private String customerName;
    private String paymentMethodName;
    private List<OrderItemDTO> items;
}
