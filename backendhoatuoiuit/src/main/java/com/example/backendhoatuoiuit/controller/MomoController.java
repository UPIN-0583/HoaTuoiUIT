package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.service.MomoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class MomoController {
    @Autowired
    private MomoService momoService;

    @PostMapping("/payment-momo")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> input) {
        try {
            if (!input.containsKey("order_total") || !input.containsKey("order_details") || !input.containsKey("customer_id") || !input.containsKey("order_name") || !input.containsKey("order_phone") || !input.containsKey("order_delivery_address")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Thiếu thông tin đầu vào."));
            }

            if (!(input.get("order_details") instanceof java.util.List) || ((java.util.List<?>) input.get("order_details")).isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "order_details phải là một mảng và không được rỗng."));
            }

            for (Object item : (java.util.List<?>) input.get("order_details")) {
                if (!(item instanceof Map) || !((Map<?, ?>) item).containsKey("product_id") || !((Map<?, ?>) item).containsKey("order_detail_quantity")) {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Mỗi mục trong order_details phải có product_id và order_detail_quantity."));
                }
            }

            Map<String, Object> momoResponse = momoService.createPayment(input);
            return ResponseEntity.ok(momoResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/payment-momo/ipn")
    public ResponseEntity<?> handleMoMoIPN(@RequestBody Map<String, String> params) {
        // Xử lý IPN từ MoMo
        System.out.println("IPN received: " + params);
        return ResponseEntity.ok().body(Map.of("success", true, "message", "IPN received"));
    }
} 