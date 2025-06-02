package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.PromotionDTO;
import com.example.backendhoatuoiuit.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public List<PromotionDTO> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @GetMapping("/{id}")
    public PromotionDTO getPromotionById(@PathVariable Integer id) {
        return promotionService.getPromotionById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PromotionDTO createPromotion(@RequestBody PromotionDTO promotionDTO) {
        return promotionService.createPromotion(promotionDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PromotionDTO updatePromotion(@PathVariable Integer id, @RequestBody PromotionDTO promotionDTO) {
        return promotionService.updatePromotion(id, promotionDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePromotion(@PathVariable Integer id) {
        promotionService.deletePromotion(id);
    }

    @PostMapping("/{id}/assign-products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignProductsToPromotion(@PathVariable Integer id, @RequestBody List<Integer> productIds) {
        promotionService.assignProductsToPromotion(id, productIds);
        return ResponseEntity.ok().build();
    }
}