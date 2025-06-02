package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.FlowerDTO;
import com.example.backendhoatuoiuit.entity.Flower;
import com.example.backendhoatuoiuit.mapper.FlowerMapper;
import com.example.backendhoatuoiuit.repository.FlowerRepository;
import com.example.backendhoatuoiuit.service.FlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flowers")
public class FlowerController {
    @Autowired
    private FlowerService flowerService;

    @GetMapping("/active")
    public List<FlowerDTO> getActiveFlowers() {
        return flowerService.getActiveFlowers();
    }

    @GetMapping
    public List<FlowerDTO> getAllFlowers() {
        return flowerService.getAllFlowers();
    }

    @GetMapping("/{id}")
    public FlowerDTO getFlowerById(@PathVariable Integer id) {
        return flowerService.getFlowerById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public FlowerDTO createFlower(@RequestBody FlowerDTO flowerDTO) {
        return flowerService.createFlower(flowerDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FlowerDTO updateFlower(@PathVariable Integer id, @RequestBody FlowerDTO flowerDTO) {
        return flowerService.updateFlower(id, flowerDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteFlower(@PathVariable Integer id) {
        flowerService.deleteFlower(id);
    }

    @GetMapping("/by-english-name")
    public ResponseEntity<FlowerDTO> getFlowerByEnglishName(@RequestParam String englishName) {
        FlowerDTO dto = flowerService.getFlowerByEnglishName(englishName);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
