package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.WishlistDTO;
import com.example.backendhoatuoiuit.dto.WishlistItemDTO;
import com.example.backendhoatuoiuit.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@PreAuthorize("hasRole('USER')")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{customerId}")
    public WishlistDTO getWishlist(@PathVariable Integer customerId) {
        return wishlistService.getWishlistByCustomerId(customerId);
    }

    @GetMapping("/{customerId}/contains/{productId}")
    public boolean isProductInWishlist(@PathVariable Integer customerId,
                                       @PathVariable Integer productId) {
        return wishlistService.isProductInWishlist(customerId, productId);
    }

    @GetMapping("/{customerId}/product-ids")
    public List<Integer> getWishlistProductIds(@PathVariable Integer customerId) {
        return wishlistService.getAllProductIdsInWishlist(customerId);
    }


    @PostMapping("/items")
    public WishlistItemDTO addItem(@RequestBody WishlistItemDTO itemDTO) {
        return wishlistService.addItemToWishlist(itemDTO);
    }

    @DeleteMapping("/items/{itemId}")
    public void removeItem(@PathVariable Integer itemId) {
        wishlistService.removeItemFromWishlist(itemId);
    }

    @DeleteMapping("/items")
    public void removeItem(@RequestParam Integer customerId,
                           @RequestParam Integer productId) {
        wishlistService.removeItemByCustomerIdAndProductId(customerId, productId);
    }

}
