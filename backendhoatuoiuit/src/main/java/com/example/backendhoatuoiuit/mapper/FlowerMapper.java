package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.FlowerDTO;
import com.example.backendhoatuoiuit.entity.Flower;
import org.springframework.stereotype.Component;

@Component
public class FlowerMapper {

    public FlowerDTO toDTO(Flower flower) {
        FlowerDTO dto = new FlowerDTO();
        dto.setId(flower.getId());
        dto.setName(flower.getName());
        dto.setDescription(flower.getDescription());
        dto.setIsActive(flower.getIsActive());
        dto.setEnglishName(flower.getEnglishName());
        return dto;
    }

    public Flower toEntity(FlowerDTO dto) {
        Flower flower = new Flower();
        flower.setId(dto.getId());
        flower.setName(dto.getName());
        flower.setDescription(dto.getDescription());
        flower.setIsActive(dto.getIsActive());
        flower.setEnglishName(dto.getEnglishName());
        return flower;
    }
}
