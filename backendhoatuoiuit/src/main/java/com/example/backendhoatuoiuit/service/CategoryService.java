package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.CategoryDTO;
import com.example.backendhoatuoiuit.entity.Category;
import com.example.backendhoatuoiuit.mapper.CategoryMapper;
import com.example.backendhoatuoiuit.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return categories.stream().map(categoryMapper::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return categoryMapper.toDTO(category);
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = categoryMapper.toEntity(categoryDTO);
        category = categoryRepository.save(category);
        return categoryMapper.toDTO(category);
    }

    public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setIsActive(categoryDTO.getIsActive());
        category = categoryRepository.save(category);
        return categoryMapper.toDTO(category);
    }

    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    public List<CategoryDTO> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }
}
