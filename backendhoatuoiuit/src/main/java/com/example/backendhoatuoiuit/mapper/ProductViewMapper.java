package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.ProductDTO;
import com.example.backendhoatuoiuit.dto.ProductViewDTO;
import com.example.backendhoatuoiuit.dto.PromotionDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class ProductViewMapper {

    public ProductViewDTO toProductViewDTO(ProductDTO product,
                                           PromotionDTO promotion,
                                           Double averageRating,
                                           boolean isFavorited) {
        if (product == null) return null;

        BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;

        // ✅ Tính số tiền giảm dựa vào phần trăm
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (promotion != null && promotion.getDiscountValue() != null) {
            BigDecimal discountPercent = promotion.getDiscountValue(); // ví dụ 10
            discountAmount = price.multiply(discountPercent)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        BigDecimal finalPrice = price.subtract(discountAmount);

        ProductViewDTO dto = new ProductViewDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(price);
        dto.setDiscountValue(discountAmount);     // số tiền đã giảm (VD: 40,000 đ)
        dto.setFinalPrice(finalPrice);            // giá sau giảm
        dto.setAverageRating(averageRating);
        dto.setImageUrl(product.getImageUrl());
        dto.setIsActive(product.getIsActive());
        dto.setCategoryId(product.getCategoryId());
        dto.setCategoryName(product.getCategoryName());
        dto.setFlowerNames(product.getFlowerNames());
        dto.setOccasionNames(product.getOccasionNames());
        dto.setIsFavorited(isFavorited);
        return dto;
    }
}
