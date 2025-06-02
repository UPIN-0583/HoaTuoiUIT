package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.entity.Occasion;
import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.entity.ProductOccasion;
import com.example.backendhoatuoiuit.entity.ProductOccasionKey;
import com.example.backendhoatuoiuit.repository.ProductOccasionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductOccasionService {

    @Autowired
    private ProductOccasionRepository productOccasionRepository;

    public List<ProductOccasion> getOccasionsByProductId(Integer productId) {
        return productOccasionRepository.findByProductId(productId);
    }

    public ProductOccasion addOccasionToProduct(ProductOccasion productOccasion) {
        ProductOccasionKey key = productOccasion.getId();

        // Tạo đối tượng Product và Occasion tạm
        Product product = new Product();
        product.setId(key.getProductId());

        Occasion occasion = new Occasion();
        occasion.setId(key.getOccasionId());

        productOccasion.setProduct(product);
        productOccasion.setOccasion(occasion);

        return productOccasionRepository.save(productOccasion);
    }

    public void removeOccasionFromProduct(Integer productId, Integer occasionId) {
        ProductOccasionKey key = new ProductOccasionKey();
        key.setProductId(productId);
        key.setOccasionId(occasionId);
        productOccasionRepository.deleteById(key);
    }
}
