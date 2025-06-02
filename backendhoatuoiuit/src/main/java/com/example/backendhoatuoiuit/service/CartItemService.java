package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.CartItemDTO;
import com.example.backendhoatuoiuit.entity.Cart;
import com.example.backendhoatuoiuit.entity.CartItem;
import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.repository.CartItemRepository;
import com.example.backendhoatuoiuit.repository.CartRepository;
import com.example.backendhoatuoiuit.mapper.CartMapper;
import com.example.backendhoatuoiuit.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private ProductRepository productRepository;


    public CartItemDTO addItemToCart(CartItemDTO dto) {
        Cart cart = cartRepository.findById(dto.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Optional<CartItem> existingItemOpt = cartItemRepository
                .findByCartIdAndProductId(dto.getCartId(), dto.getProductId());

        CartItem item;
        if (existingItemOpt.isPresent()) {
            item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + dto.getQuantity());
        } else {
            item = new CartItem();
            item.setCart(cart);

            // ✅ Load đầy đủ Product từ DB
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            item.setProduct(product);

            item.setQuantity(dto.getQuantity());
        }

        item = cartItemRepository.save(item);

        return cartMapper.toItemDTO(item);
    }


    public Integer getCartItemCountByCustomerId(Integer customerId) {

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return cartItemRepository.sumQuantityByCartId(cart.getId()).orElse(0);
    }

    public void removeItemByCartIdAndProductId(Integer cartId, Integer productId) {
        CartItem item = cartItemRepository.findByCartIdAndProductId(cartId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItemRepository.delete(item);
    }


    public void removeItemFromCart(Integer itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public CartItemDTO updateQuantity(Integer itemId, Integer newQuantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        if (newQuantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        item.setQuantity(newQuantity);
        item = cartItemRepository.save(item);

        return cartMapper.toItemDTO(item);
    }

    public BigDecimal calculateCartTotal(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return cart.getItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    if (product == null) return BigDecimal.ZERO; // tránh null
                    BigDecimal price = product.getPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public CartItemDTO updateQuantityByCustomer(Integer itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        item.setQuantity(quantity);
        item = cartItemRepository.save(item);

        return cartMapper.toItemDTO(item);
    }

}
