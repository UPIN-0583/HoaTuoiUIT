package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.CartDTO;
import com.example.backendhoatuoiuit.entity.Cart;
import com.example.backendhoatuoiuit.entity.Customer;
import com.example.backendhoatuoiuit.mapper.CartMapper;
import com.example.backendhoatuoiuit.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartMapper cartMapper;

    public CartDTO getCartByCustomerId(Integer customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    Customer customer = new Customer();
                    customer.setId(customerId);
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
        return cartMapper.toDTO(cart);
    }
}
