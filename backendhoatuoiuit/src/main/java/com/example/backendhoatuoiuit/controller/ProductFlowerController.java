package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.entity.ProductFlower;
import com.example.backendhoatuoiuit.service.ProductFlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-flower")
public class ProductFlowerController {

    @Autowired
    private ProductFlowerService productFlowerService;

    @GetMapping("/product/{productId}")
    public List<ProductFlower> getFlowersByProduct(@PathVariable Integer productId) {
        return productFlowerService.getFlowersByProductId(productId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProductFlower addFlowerToProduct(@RequestBody ProductFlower productFlower) {
        return productFlowerService.addFlowerToProduct(productFlower);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void removeFlowerFromProduct(@RequestParam Integer productId, @RequestParam Integer flowerId) {
        productFlowerService.removeFlowerFromProduct(productId, flowerId);
    }
}
