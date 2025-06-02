package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.CartDTO;
import com.example.backendhoatuoiuit.dto.CartItemDTO;
import com.example.backendhoatuoiuit.dto.PromotionDTO;
import com.example.backendhoatuoiuit.entity.Cart;
import com.example.backendhoatuoiuit.entity.CartItem;
import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.service.PromotionService;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    private final PromotionService promotionService;

    public CartMapper(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    public CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setCustomerId(cart.getCustomer() != null ? cart.getCustomer().getId() : null);

        if (cart.getItems() != null) {
            List<CartItemDTO> items = cart.getItems().stream()
                    .map(this::toItemDTO)
                    .collect(Collectors.toList());
            dto.setItems(items);
        }

        return dto;
    }

    public CartItemDTO toItemDTO(CartItem item) {
        Product product = item.getProduct();

        // ✅ Nếu product null thì trả item rỗng (hoặc ném lỗi nếu bạn muốn)
        if (product == null) {
            throw new RuntimeException("CartItem không có thông tin Product");
        }

        // ✅ Nếu giá null thì gán mặc định 0
        BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
        double priceValue = price.doubleValue();

        // ✅ Lấy khuyến mãi
        PromotionDTO promotion = promotionService.getActivePromotionForProduct(product.getId());
        double discountPercent = (promotion != null && promotion.getDiscountValue() != null)
                ? promotion.getDiscountValue().doubleValue()
                : 0.0;

        double discountApplied = priceValue * (discountPercent / 100.0);
        double priceAfterDiscount = priceValue - discountApplied;

        // ✅ Gán vào DTO
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setCartId(item.getCart() != null ? item.getCart().getId() : null);
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setImageUrl(product.getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(priceValue);
        dto.setAddedDate(item.getAddedDate());
        dto.setDiscountApplied(discountApplied);
        dto.setPriceAfterDiscount(priceAfterDiscount);

        return dto;
    }

}
