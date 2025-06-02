package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "occasion")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Occasion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    public Occasion(Integer id) {
        this.id = id;
    }

}
