package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_occasion")
@Getter
@Setter
@NoArgsConstructor
public class ProductOccasion {

    @EmbeddedId
    private ProductOccasionKey id = new ProductOccasionKey();

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @MapsId("occasionId")
    @JoinColumn(name = "occasion_id")
    private Occasion occasion;
}
