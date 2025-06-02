package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class ProductOccasionKey implements Serializable {
    private Integer productId;
    private Integer occasionId;
}
