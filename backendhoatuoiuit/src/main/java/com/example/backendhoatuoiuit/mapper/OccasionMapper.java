package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.OccasionDTO;
import com.example.backendhoatuoiuit.entity.Occasion;
import org.springframework.stereotype.Component;

@Component
public class OccasionMapper {

    public OccasionDTO toDTO(Occasion occasion) {
        OccasionDTO dto = new OccasionDTO();
        dto.setId(occasion.getId());
        dto.setName(occasion.getName());
        dto.setDescription(occasion.getDescription());
        dto.setIsActive(occasion.getIsActive());
        dto.setImageUrl(occasion.getImageUrl());
        return dto;
    }

    public Occasion toEntity(OccasionDTO dto) {
        Occasion occasion = new Occasion();
        occasion.setId(dto.getId());
        occasion.setName(dto.getName());
        occasion.setDescription(dto.getDescription());
        occasion.setIsActive(dto.getIsActive());
        occasion.setImageUrl(dto.getImageUrl());
        return occasion;
    }
}
