package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.WishlistDTO;
import com.example.backendhoatuoiuit.dto.WishlistItemDTO;
import com.example.backendhoatuoiuit.entity.*;
import com.example.backendhoatuoiuit.mapper.WishlistMapper;
import com.example.backendhoatuoiuit.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistMapper wishlistMapper;

    public WishlistDTO getWishlistByCustomerId(Integer customerId) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    Customer customer = new Customer();
                    customer.setId(customerId);
                    newWishlist.setCustomer(customer);
                    return wishlistRepository.save(newWishlist);
                });


        List<WishlistItem> items = wishlist.getItems();
        if (items != null) {
            items.sort((a, b) -> {
                LocalDateTime da = a.getAddedDate();
                LocalDateTime db = b.getAddedDate();
                if (da == null && db == null) return 0;
                if (da == null) return 1;
                if (db == null) return -1;
                return db.compareTo(da);
            });
        }


        return wishlistMapper.toDTO(wishlist);
    }


    public WishlistItemDTO addItemToWishlist(WishlistItemDTO itemDTO) {
        Wishlist wishlist = wishlistRepository.findByCustomerId(itemDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        if (wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), itemDTO.getProductId()).isPresent()) {
            throw new RuntimeException("Item already exists in wishlist");
        }

        Product product = productRepository.findById(itemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem item = new WishlistItem();
        item.setWishlist(wishlist);
        item.setProduct(product);

        WishlistItem saved = wishlistItemRepository.save(item);
        return wishlistMapper.toItemDTO(saved);
    }

    public void removeItemFromWishlist(Integer itemId) {
        wishlistItemRepository.deleteById(itemId);
    }

    public boolean isProductInWishlist(Integer customerId, Integer productId) {
        return wishlistItemRepository.existsByCustomerIdAndProductId(customerId, productId);
    }

    public List<Integer> getAllProductIdsInWishlist(Integer customerId) {
        return wishlistItemRepository.findAllProductIdsInWishlist(customerId);
    }

    public void removeItemByCustomerIdAndProductId(Integer customerId, Integer productId) {
        WishlistItem item = wishlistItemRepository
                .findByCustomerIdAndProductId(customerId, productId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        wishlistItemRepository.delete(item);
    }


}
