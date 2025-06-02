package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.PaymentDTO;
import com.example.backendhoatuoiuit.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentName(payment.getPaymentName());
        dto.setDescription(payment.getDescription());
        dto.setIsActive(payment.getIsActive());
        return dto;
    }

    public Payment toEntity(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setId(dto.getId());
        payment.setPaymentName(dto.getPaymentName());
        payment.setDescription(dto.getDescription());
        payment.setIsActive(dto.getIsActive());
        return payment;
    }
}
