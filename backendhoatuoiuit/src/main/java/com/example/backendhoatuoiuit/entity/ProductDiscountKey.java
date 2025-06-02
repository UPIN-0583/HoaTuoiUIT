package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ProductDiscountKey implements Serializable {
    private Integer productId;
    private Integer discountId;
}
