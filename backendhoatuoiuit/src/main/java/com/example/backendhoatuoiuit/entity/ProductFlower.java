package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_flower")
@Getter
@Setter
@NoArgsConstructor
public class ProductFlower {

    @EmbeddedId
    private ProductFlowerKey id = new ProductFlowerKey();

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @MapsId("flowerId")
    @JoinColumn(name = "flower_id")
    private Flower flower;
}
