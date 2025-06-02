package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.PaymentDTO;
import com.example.backendhoatuoiuit.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<PaymentDTO> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public PaymentDTO getPaymentById(@PathVariable Integer id) {
        return paymentService.getPaymentById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaymentDTO createPayment(@RequestBody PaymentDTO paymentDTO) {
        return paymentService.createPayment(paymentDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PaymentDTO updatePayment(@PathVariable Integer id, @RequestBody PaymentDTO paymentDTO) {
        return paymentService.updatePayment(id, paymentDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
    }
}

