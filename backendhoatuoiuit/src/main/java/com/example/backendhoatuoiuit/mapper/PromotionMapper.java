package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.PromotionDTO;
import com.example.backendhoatuoiuit.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

    public PromotionDTO toDTO(Promotion promotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(promotion.getId());
        dto.setCode(promotion.getCode());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setDescription(promotion.getDescription());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setIsActive(promotion.getIsActive());
        return dto;
    }

    public Promotion toEntity(PromotionDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setId(dto.getId());
        promotion.setCode(dto.getCode());
        promotion.setDiscountValue(dto.getDiscountValue());
        promotion.setDescription(dto.getDescription());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        promotion.setIsActive(dto.getIsActive());
        return promotion;
    }
}
