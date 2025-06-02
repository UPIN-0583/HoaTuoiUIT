package com.example.backendhoatuoiuit.dto;

import lombok.Data;
import java.util.List;

@Data
public class WishlistDTO {
    private Integer id;
    private Integer customerId;
    private List<WishlistItemDTO> items;
}
