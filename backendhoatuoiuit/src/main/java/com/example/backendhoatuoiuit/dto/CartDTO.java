package com.example.backendhoatuoiuit.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartDTO {
    private Integer id;
    private Integer customerId;
    private List<CartItemDTO> items;
}
