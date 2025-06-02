package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist_item", uniqueConstraints = @UniqueConstraint(columnNames = {"wishlist_id", "product_id"}))
@Getter
@Setter
@NoArgsConstructor
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "wishlist_id")
    private Wishlist wishlist;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "added_date", nullable = false)
    private LocalDateTime addedDate = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (addedDate == null) {
            addedDate = LocalDateTime.now();
        }
    }
}
