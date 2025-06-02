package com.example.backendhoatuoiuit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "flowers")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(length = 100, unique = true)
    private String englishName;

    public Flower(Integer id) {
        this.id = id;
    }

}
