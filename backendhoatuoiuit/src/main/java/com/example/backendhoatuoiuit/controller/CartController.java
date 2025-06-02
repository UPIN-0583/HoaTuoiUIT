package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.CartDTO;
import com.example.backendhoatuoiuit.dto.CartItemDTO;
import com.example.backendhoatuoiuit.service.CartService;
import com.example.backendhoatuoiuit.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/carts")
@PreAuthorize("hasRole('USER')") // Tất cả thao tác giỏ hàng đều là của người dùng
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private CartItemService cartItemService;

    @GetMapping("/{customerId}")
    public CartDTO getCart(@PathVariable Integer customerId) {
        return cartService.getCartByCustomerId(customerId);
    }

    @PostMapping("/items")
    public CartItemDTO addItem(@RequestBody CartItemDTO cartItemDTO) {
        return cartItemService.addItemToCart(cartItemDTO);
    }

    @GetMapping("/{customerId}/count")
    public Integer getCartItemCount(@PathVariable Integer customerId) {
        return cartItemService.getCartItemCountByCustomerId(customerId);
    }


    @DeleteMapping("/items/{itemId}")
    public void removeItem(@PathVariable Integer itemId) {
        cartItemService.removeItemFromCart(itemId);
    }

    @DeleteMapping("/items")
    public void removeItem(@RequestParam Integer cartId,
                           @RequestParam Integer productId) {
        cartItemService.removeItemByCartIdAndProductId(cartId, productId);
    }


    @PutMapping("/items/{itemId}/quantity")
    public CartItemDTO updateItemQuantity(@PathVariable Integer itemId, @RequestParam("quantity") Integer quantity) {
        return cartItemService.updateQuantity(itemId, quantity);
    }

    @GetMapping("/{cartId}/total")
    public BigDecimal getCartTotal(@PathVariable Integer cartId) {
        return cartItemService.calculateCartTotal(cartId);
    }

    @PutMapping("/{customerId}/items/{itemId}/quantity")
    public CartItemDTO updateItemQuantityWithCustomerId(
            @PathVariable Integer customerId,
            @PathVariable Integer itemId,
            @RequestParam("quantity") Integer quantity) {

        return cartItemService.updateQuantityByCustomer(itemId, quantity);
    }

}
