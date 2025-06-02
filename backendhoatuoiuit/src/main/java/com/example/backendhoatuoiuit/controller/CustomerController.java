package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.CustomerDTO;
import com.example.backendhoatuoiuit.dto.LoginRequestDTO;
import com.example.backendhoatuoiuit.dto.LoginResponseDTO;
import com.example.backendhoatuoiuit.dto.SignupRequestDTO;
import com.example.backendhoatuoiuit.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CustomerDTO> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public CustomerDTO getCustomerById(@PathVariable Integer id) {
        return customerService.getCustomerById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CustomerDTO createCustomer(@RequestBody CustomerDTO customerDTO) {
        return customerService.createCustomer(customerDTO);
    }

    @PutMapping("/{id}")
    public CustomerDTO updateCustomer(@PathVariable Integer id, @RequestBody CustomerDTO customerDTO) {
        return customerService.updateCustomer(id, customerDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = customerService.loginCustomer(
                loginRequest.getEmail(), loginRequest.getPassword()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body("Đã đăng xuất thành công");
    }

    @PostMapping("/signup")
    public CustomerDTO signupCustomer(@RequestBody SignupRequestDTO signupRequest) {
        return customerService.signupCustomer(signupRequest);
    }
}
