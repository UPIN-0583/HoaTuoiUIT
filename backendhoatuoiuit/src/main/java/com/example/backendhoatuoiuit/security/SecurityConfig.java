package com.example.backendhoatuoiuit.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity // ✅ Cho phép dùng @PreAuthorize("hasRole('ADMIN')")
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable()
                .authorizeHttpRequests()
                        .requestMatchers("/api/customers/login", "/api/customers/signup", "/uploads/**", "/api/forgotpass", "/api/confirm","/chatbot/suggest").permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/api/categories/**",
                        "/api/flowers/**",
                        "/api/occasions/**",
                        "/api/products/**",
                        "/api/promotions/**",
                        "/api/reviews/**",
                        "/api/order-products/order/**",
                        "/api/order-products/order/*/total-amount",
                        "/api/payments/**",
                        "/api/product-discount/product/**",
                        "/api/product-flower/product/**",
                        "/api/product-occasion/product/**",
                        "/api/orders/**",
                        "/api/orders/orders/*",
                        "/api/blog/**",
                        "/api/customers/**"
                ).permitAll()
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // ✅ Kiểm tra JWT
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
