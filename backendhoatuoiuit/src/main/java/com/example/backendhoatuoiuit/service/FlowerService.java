package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.FlowerDTO;
import com.example.backendhoatuoiuit.dto.OccasionDTO;
import com.example.backendhoatuoiuit.entity.Flower;
import com.example.backendhoatuoiuit.mapper.FlowerMapper;
import com.example.backendhoatuoiuit.repository.FlowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlowerService {

    @Autowired
    private FlowerRepository flowerRepository;

    @Autowired
    private FlowerMapper flowerMapper;

    public List<FlowerDTO> getAllFlowers() {
        List<Flower> flowers = flowerRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return flowers.stream().map(flowerMapper::toDTO).collect(Collectors.toList());
    }

    public FlowerDTO getFlowerById(Integer id) {
        Flower flower = flowerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flower not found"));
        return flowerMapper.toDTO(flower);
    }

    public FlowerDTO createFlower(FlowerDTO flowerDTO) {
        Flower flower = flowerMapper.toEntity(flowerDTO);
        flower = flowerRepository.save(flower);
        return flowerMapper.toDTO(flower);
    }

    public FlowerDTO updateFlower(Integer id, FlowerDTO flowerDTO) {
        Flower flower = flowerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flower not found"));
        flower.setName(flowerDTO.getName());
        flower.setDescription(flowerDTO.getDescription());
        flower.setIsActive(flowerDTO.getIsActive());
        flower = flowerRepository.save(flower);
        return flowerMapper.toDTO(flower);
    }

    public void deleteFlower(Integer id) {
        flowerRepository.deleteById(id);
    }

    public List<FlowerDTO> getActiveFlowers() {
        return flowerRepository.findByIsActiveTrue()
                .stream()
                .map(flowerMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FlowerDTO getFlowerByEnglishName(String englishName) {
        Flower flower = flowerRepository.findByEnglishName(englishName);
        if (flower == null) {
            return null;  // hoặc throw exception nếu muốn
        }
        return flowerMapper.toDTO(flower);
    }
}
