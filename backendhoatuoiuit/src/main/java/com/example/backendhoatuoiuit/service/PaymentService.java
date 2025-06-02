package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.PaymentDTO;
import com.example.backendhoatuoiuit.entity.Payment;
import com.example.backendhoatuoiuit.mapper.PaymentMapper;
import com.example.backendhoatuoiuit.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentMapper paymentMapper;

    public List<PaymentDTO> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream().map(paymentMapper::toDTO).collect(Collectors.toList());
    }

    public PaymentDTO getPaymentById(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return paymentMapper.toDTO(payment);
    }

    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    public PaymentDTO updatePayment(Integer id, PaymentDTO paymentDTO) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaymentName(paymentDTO.getPaymentName());
        payment.setDescription(paymentDTO.getDescription());
        payment.setIsActive(paymentDTO.getIsActive());
        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }
}
