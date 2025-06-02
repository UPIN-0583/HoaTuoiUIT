package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.service.ConfirmPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConfirmPasswordController {
    @Autowired
    private ConfirmPasswordService confirmPasswordService;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        String newPassword = body.get("newPassword");
        Map<String, Object> result = confirmPasswordService.confirm(email, code, newPassword);
        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
} 