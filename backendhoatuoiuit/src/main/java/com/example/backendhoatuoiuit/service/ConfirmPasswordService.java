package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.entity.ForgotPassword;
import com.example.backendhoatuoiuit.entity.Customer;
import com.example.backendhoatuoiuit.repository.ForgotPasswordRepository;
import com.example.backendhoatuoiuit.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ConfirmPasswordService {
    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> confirm(String email, String code, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<ForgotPassword> forgotPasswordOpt = forgotPasswordRepository.findByEmail(email);
        if (forgotPasswordOpt.isPresent()) {
            ForgotPassword forgotPassword = forgotPasswordOpt.get();
            if (forgotPassword.getCode() == Integer.parseInt(code)) {
                Optional<Customer> customerOpt = customerRepository.findByEmail(email);
                if (customerOpt.isPresent()) {
                    Customer customer = customerOpt.get();
                    customer.setPasswordHash(passwordEncoder.encode(newPassword));
                    customerRepository.save(customer);
                    forgotPasswordRepository.delete(forgotPassword);
                    response.put("success", true);
                    response.put("message", "Thay đổi mật khẩu thành công");
                } else {
                    response.put("success", false);
                    response.put("message", "Email không chính xác");
                }
            } else {
                response.put("success", false);
                response.put("message", "Code xác thực không chính xác");
            }
        } else {
            response.put("success", false);
            response.put("message", "Email không chính xác");
        }
        return response;
    }
} 