package com.example.backendhoatuoiuit.security;

import com.example.backendhoatuoiuit.entity.Customer;
import com.example.backendhoatuoiuit.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy khách hàng với email: " + email));

        return User.builder()
                .username(customer.getEmail())
                .password(customer.getPasswordHash()) // nên dùng bcrypt
                .roles("USER")
                .build();
    }
}
