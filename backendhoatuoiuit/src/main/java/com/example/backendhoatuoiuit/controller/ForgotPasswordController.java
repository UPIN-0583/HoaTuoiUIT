package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ForgotPasswordController {
    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/forgotpass")
    public ResponseEntity<?> forgotPass(@RequestBody Map<String, String> body) {
        String userEmail = body.get("user_email");
        Map<String, Object> result = forgotPasswordService.sendCode(userEmail);
        return ResponseEntity.ok(result);
    }
} 