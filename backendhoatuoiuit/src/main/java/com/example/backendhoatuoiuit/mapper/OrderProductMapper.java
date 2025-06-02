package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.OrderProductDTO;
import com.example.backendhoatuoiuit.entity.Order;
import com.example.backendhoatuoiuit.entity.OrderProduct;
import com.example.backendhoatuoiuit.entity.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class OrderProductMapper {

    public OrderProductDTO toDTO(OrderProduct entity) {
        OrderProductDTO dto = new OrderProductDTO();
        dto.setId(entity.getId());
        dto.setOrderId(entity.getOrder() != null ? entity.getOrder().getId() : null);
        dto.setProductId(entity.getProduct() != null ? entity.getProduct().getId() : null);
        dto.setQuantity(entity.getQuantity());
        dto.setPrice(entity.getPrice());
        dto.setDiscountApplied(entity.getDiscountApplied());
        return dto;
    }

    public OrderProduct toEntity(OrderProductDTO dto) {
        OrderProduct entity = new OrderProduct();
        entity.setId(dto.getId());
        if (dto.getOrderId() != null) {
            Order order = new Order();
            order.setId(dto.getOrderId());
            entity.setOrder(order);
        }
        if (dto.getProductId() != null) {
            Product product = new Product();
            product.setId(dto.getProductId());
            entity.setProduct(product);
        }
        entity.setQuantity(dto.getQuantity());
        entity.setPrice(dto.getPrice());
        entity.setDiscountApplied(dto.getDiscountApplied() != null ? dto.getDiscountApplied() : BigDecimal.ZERO);
        return entity;
    }
}
