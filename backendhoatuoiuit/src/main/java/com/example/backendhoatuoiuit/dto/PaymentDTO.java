package com.example.backendhoatuoiuit.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private Integer id;
    private String paymentName;
    private String description;
    private Boolean isActive;
}
