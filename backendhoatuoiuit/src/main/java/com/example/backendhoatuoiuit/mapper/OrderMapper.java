package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.OrderDTO;
import com.example.backendhoatuoiuit.dto.OrderItemDTO;
import com.example.backendhoatuoiuit.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer() != null ? order.getCustomer().getId() : null);
        dto.setOrderDate(order.getOrderDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setPaymentId(order.getPayment() != null ? order.getPayment().getId() : null);
        dto.setNote(order.getNote());

        if (order.getCustomer() != null) {
            dto.setCustomerName(order.getCustomer().getName());
        }

        if (order.getPayment() != null) {
            dto.setPaymentMethodName(order.getPayment().getPaymentName());
        }

        // Map danh sách sản phẩm trong đơn hàng (OrderProduct -> OrderItemDTO)
        if (order.getOrderProducts() != null) {
            List<OrderItemDTO> itemDTOs = order.getOrderProducts().stream().map(op -> {
                OrderItemDTO item = new OrderItemDTO();
                item.setProductId(op.getProduct().getId());
                item.setProductName(op.getProduct().getName());
                item.setQuantity(op.getQuantity());
                item.setPrice(op.getPrice());

                // Tính giảm giá và giá sau giảm
                BigDecimal discount = op.getDiscountApplied() != null ? op.getDiscountApplied() : BigDecimal.ZERO;
                item.setDiscountApplied(discount);
                item.setPriceAfterDiscount(op.getPrice().subtract(discount));

                return item;
            }).collect(Collectors.toList());

            dto.setItems(itemDTOs);
        }

        return dto;
    }

    public Order toEntity(OrderDTO dto) {
        Order order = new Order();
        order.setId(dto.getId());

        if (dto.getCustomerId() != null) {
            Customer customer = new Customer();
            customer.setId(dto.getCustomerId());
            order.setCustomer(customer);
        }

        order.setOrderDate(dto.getOrderDate() != null ? dto.getOrderDate() : LocalDateTime.now());
        order.setDeliveryDate(dto.getDeliveryDate());
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setTotalAmount(dto.getTotalAmount());
        order.setStatus(OrderStatus.valueOf(dto.getStatus()));

        if (dto.getPaymentId() != null) {
            Payment payment = new Payment();
            payment.setId(dto.getPaymentId());
            order.setPayment(payment);
        }

        if (dto.getItems() != null) {
            List<OrderProduct> orderProducts = dto.getItems().stream().map(itemDTO -> {
                OrderProduct op = new OrderProduct();
                op.setOrder(order);
                Product product = new Product();
                product.setId(itemDTO.getProductId());
                op.setProduct(product);
                op.setQuantity(itemDTO.getQuantity());
                op.setPrice(itemDTO.getPrice());
                op.setDiscountApplied(itemDTO.getDiscountApplied() != null ? itemDTO.getDiscountApplied() : BigDecimal.ZERO);
                return op;
            }).collect(Collectors.toList());
            order.setOrderProducts(orderProducts);
        }

        order.setNote(dto.getNote());
        return order;
    }
}
