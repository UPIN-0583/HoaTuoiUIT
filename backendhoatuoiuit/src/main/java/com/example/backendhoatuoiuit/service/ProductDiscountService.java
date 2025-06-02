package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.entity.ProductDiscount;
import com.example.backendhoatuoiuit.entity.ProductDiscountKey;
import com.example.backendhoatuoiuit.entity.Promotion;
import com.example.backendhoatuoiuit.repository.ProductDiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductDiscountService {

    @Autowired
    private ProductDiscountRepository productDiscountRepository;

    public List<ProductDiscount> getDiscountsByProductId(Integer productId) {
        return productDiscountRepository.findByProductId(productId);
    }

    public ProductDiscount addDiscountToProduct(ProductDiscount productDiscount) {
        ProductDiscountKey key = productDiscount.getId();

        // Tạo đối tượng Product và Promotion tạm
        Product product = new Product();
        product.setId(key.getProductId());

        Promotion promotion = new Promotion();
        promotion.setId(key.getDiscountId());

        productDiscount.setProduct(product);
        productDiscount.setPromotion(promotion);

        return productDiscountRepository.save(productDiscount);
    }

    public void removeDiscountFromProduct(Integer productId, Integer discountId) {
        ProductDiscountKey key = new ProductDiscountKey();
        key.setProductId(productId);
        key.setDiscountId(discountId);
        productDiscountRepository.deleteById(key);
    }


}
