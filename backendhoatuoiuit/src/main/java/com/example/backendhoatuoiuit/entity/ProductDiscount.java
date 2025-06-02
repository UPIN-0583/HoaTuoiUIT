package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_discount")
@Getter
@Setter
@NoArgsConstructor
public class ProductDiscount {

    @EmbeddedId
    private ProductDiscountKey id = new ProductDiscountKey();

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @MapsId("discountId")
    @JoinColumn(name = "discount_id")
    private Promotion promotion;
}
