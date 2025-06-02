package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.PromotionDTO;
import com.example.backendhoatuoiuit.entity.Product;
import com.example.backendhoatuoiuit.entity.ProductDiscount;
import com.example.backendhoatuoiuit.entity.ProductDiscountKey;
import com.example.backendhoatuoiuit.entity.Promotion;
import com.example.backendhoatuoiuit.mapper.PromotionMapper;
import com.example.backendhoatuoiuit.repository.ProductDiscountRepository;
import com.example.backendhoatuoiuit.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PromotionMapper promotionMapper;

    @Autowired
    private ProductDiscountRepository productDiscountRepository;


    public List<PromotionDTO> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return promotions.stream().map(promotionMapper::toDTO).collect(Collectors.toList());
    }

    public PromotionDTO getPromotionById(Integer id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        return promotionMapper.toDTO(promotion);
    }

    public PromotionDTO createPromotion(PromotionDTO promotionDTO) {
        Promotion promotion = promotionMapper.toEntity(promotionDTO);
        promotion = promotionRepository.save(promotion);

        if (promotionDTO.getProductIds() != null) {
            for (Integer productId : promotionDTO.getProductIds()) {
                ProductDiscount pd = new ProductDiscount();
                pd.setId(new ProductDiscountKey(productId, promotion.getId()));
                pd.setProduct(new Product(productId));
                pd.setPromotion(promotion);
                productDiscountRepository.save(pd);
            }
        }
        return promotionMapper.toDTO(promotion);
    }

    public PromotionDTO updatePromotion(Integer id, PromotionDTO promotionDTO) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        promotion.setCode(promotionDTO.getCode());
        promotion.setDiscountValue(promotionDTO.getDiscountValue());
        promotion.setDescription(promotionDTO.getDescription());
        promotion.setStartDate(promotionDTO.getStartDate());
        promotion.setEndDate(promotionDTO.getEndDate());
        promotion.setIsActive(promotionDTO.getIsActive());
        promotion = promotionRepository.save(promotion);
        return promotionMapper.toDTO(promotion);
    }

    public void deletePromotion(Integer id) {
        promotionRepository.deleteById(id);
    }

    @Transactional
    public void assignProductsToPromotion(Integer promotionId, List<Integer> productIds) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        productDiscountRepository.deleteByPromotionId(promotionId);

        for (Integer productId : productIds) {
            Product product = new Product();
            product.setId(productId);

            ProductDiscount pd = new ProductDiscount();
            pd.setId(new ProductDiscountKey(productId, promotionId));
            pd.setProduct(product);
            pd.setPromotion(promotion);

            productDiscountRepository.save(pd);
        }
    }


    public PromotionDTO getActivePromotionForProduct(Integer productId) {
        List<Promotion> promotions = promotionRepository.findActivePromotionsByProductId(productId);
        if (promotions.isEmpty()) return null;

        return promotionMapper.toDTO(promotions.get(0)); // lấy khuyến mãi đầu tiên nếu có
    }
}
