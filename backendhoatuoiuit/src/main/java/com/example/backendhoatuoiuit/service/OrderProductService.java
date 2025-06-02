package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.OrderProductDTO;
import com.example.backendhoatuoiuit.entity.OrderProduct;
import com.example.backendhoatuoiuit.mapper.OrderProductMapper;
import com.example.backendhoatuoiuit.repository.OrderProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderProductService {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private OrderProductMapper orderProductMapper;

    public List<OrderProductDTO> getProductsByOrderId(Integer orderId) {
        return orderProductRepository.findByOrderId(orderId)
                .stream()
                .map(orderProductMapper::toDTO)
                .collect(Collectors.toList());
    }


    public BigDecimal calculateTotalAmountByOrderId(Integer orderId) {
        BigDecimal total = orderProductRepository.calculateTotalAmountByOrderId(orderId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public OrderProductDTO addOrderProduct(OrderProductDTO dto) {
        OrderProduct entity = orderProductMapper.toEntity(dto);
        entity = orderProductRepository.save(entity);
        orderService.updateTotalAmount(dto.getOrderId());
        return orderProductMapper.toDTO(entity);
    }

    public void deleteOrderProduct(Integer id) {
        OrderProduct orderProduct = orderProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Product not found"));
        Integer orderId = orderProduct.getOrder().getId();
        orderProductRepository.deleteById(id);
        orderService.updateTotalAmount(orderId);
    }

}
