package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.entity.Flower;
import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.entity.ProductFlower;
import com.example.backendhoatuoiuit.entity.ProductFlowerKey;
import com.example.backendhoatuoiuit.repository.ProductFlowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductFlowerService {

    @Autowired
    private ProductFlowerRepository productFlowerRepository;

    public List<ProductFlower> getFlowersByProductId(Integer productId) {
        return productFlowerRepository.findByProductId(productId);
    }

    public ProductFlower addFlowerToProduct(ProductFlower productFlower) {
        ProductFlowerKey key = productFlower.getId();

        // Tạo đối tượng Product và Flower tạm (chỉ cần ID)
        Product product = new Product();
        product.setId(key.getProductId());

        Flower flower = new Flower();
        flower.setId(key.getFlowerId());

        productFlower.setProduct(product);
        productFlower.setFlower(flower);

        return productFlowerRepository.save(productFlower);
    }


    public void removeFlowerFromProduct(Integer productId, Integer flowerId) {
        ProductFlowerKey key = new ProductFlowerKey();
        key.setProductId(productId);
        key.setFlowerId(flowerId);
        productFlowerRepository.deleteById(key);
    }
}
