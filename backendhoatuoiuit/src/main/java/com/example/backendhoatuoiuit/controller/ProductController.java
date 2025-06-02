package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.ProductDTO;
import com.example.backendhoatuoiuit.dto.ProductViewDTO;
import com.example.backendhoatuoiuit.dto.PromotionDTO;
import com.example.backendhoatuoiuit.mapper.ProductViewMapper;
import com.example.backendhoatuoiuit.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private PromotionService promotionService;

    @Autowired

    private ReviewService reviewService;
    @Autowired
    private ProductViewMapper productViewMapper;

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/featured")
    public List<ProductDTO> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    @GetMapping("/active")
    public List<ProductDTO> getActiveProducts() {
        return productService.getActiveProducts();
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductDTO> getProductsByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/top-sellers")
    public List<ProductDTO> getTopSellers(@RequestParam(defaultValue = "10") int limit) {
        return productService.getTopSellingProducts(limit);
    }

    @GetMapping("/{id}/related")
    public List<ProductViewDTO> getRelatedProducts(@PathVariable Integer id,
                                                   @RequestParam(required = false) Integer customerId) {
        List<ProductDTO> related = productService.getRelatedProducts(id);

        Set<Integer> favoritedProductIds = (customerId != null)
                ? new HashSet<>(wishlistService.getAllProductIdsInWishlist(customerId))
                : Collections.emptySet();

        return related.stream().map(product -> {
            PromotionDTO promo = promotionService.getActivePromotionForProduct(product.getId());
            Double rating = reviewService.getAverageRatingByProductId(product.getId());
            boolean isFavorited = favoritedProductIds.contains(product.getId());

            return productViewMapper.toProductViewDTO(product, promo, rating, isFavorited);
        }).toList();
    }


    @GetMapping("/most-discounted")
    public List<ProductDTO> getMostDiscountedProducts(@RequestParam(defaultValue = "10") int limit) {
        return productService.getMostDiscountedProducts(limit);
    }

    @GetMapping("/filter")
    public Page<ProductDTO> filterProducts(@RequestParam(required = false) String name,
                                           @RequestParam(required = false) Integer categoryId,
                                           @RequestParam(required = false) Integer occasionId,
                                           @RequestParam(required = false) BigDecimal minPrice,
                                           @RequestParam(required = false) BigDecimal maxPrice,
                                           @RequestParam(required = false) Boolean isFeatured,
                                           @RequestParam(required = false) Boolean isActive,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size,
                                           @RequestParam(defaultValue = "id,asc") String[] sort) {
        return productService.filterProducts(name, categoryId, occasionId, minPrice, maxPrice, isFeatured, isActive, page, size, sort);
    }

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProductDTO updateProduct(@PathVariable Integer id, @RequestBody ProductDTO productDTO) {
        return productService.updateProduct(id, productDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ProductDTO toggleProductActive(@PathVariable Integer id) {
        return productService.toggleProductActive(id);
    }

    @PostMapping("/{id}/assign-occasions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignOccasions(@PathVariable Integer id, @RequestBody List<Integer> occasionIds) {
        productService.assignOccasions(id, occasionIds);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/assign-flowers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignFlowers(@PathVariable Integer id, @RequestBody List<Integer> flowerIds) {
        productService.assignFlowers(id, flowerIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/detail")
    public ProductViewDTO getProductDetail(@PathVariable Integer id,
                                           @RequestParam(required = false) Integer customerId) {
        ProductDTO product = productService.getProductById(id);
        PromotionDTO promotion = promotionService.getActivePromotionForProduct(id);
        Double rating = reviewService.getAverageRatingByProductId(id);

        boolean isFavorited = (customerId != null)
                && wishlistService.isProductInWishlist(customerId, id);

        return productViewMapper.toProductViewDTO(product, promotion, rating, isFavorited);
    }


    @GetMapping("/view-all")
    public List<ProductViewDTO> getAllProductViews(@RequestParam(required = false) Integer customerId) {
        List<ProductDTO> products = productService.getAllActiveProducts();

        // Nếu chưa đăng nhập, trả về danh sách rỗng
        Set<Integer> favoritedProductIds = (customerId != null)
                ? new HashSet<>(wishlistService.getAllProductIdsInWishlist(customerId))
                : Collections.emptySet();

        return products.stream().map(product -> {
            PromotionDTO promo = promotionService.getActivePromotionForProduct(product.getId());
            Double rating = reviewService.getAverageRatingByProductId(product.getId());
            boolean isFavorited = favoritedProductIds.contains(product.getId());

            return productViewMapper.toProductViewDTO(product, promo, rating, isFavorited);
        }).collect(Collectors.toList());
    }

    @GetMapping("/by-flower")
    public List<ProductDTO> getProductsByFlower(@RequestParam String englishName) {
        return productService.getProductsByFlowerEnglishName(englishName);
    }


}
