package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.CategoryDTO;
import com.example.backendhoatuoiuit.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIsActive(category.getIsActive());
        return dto;
    }

    public Category toEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIsActive(dto.getIsActive());
        return category;
    }
}
