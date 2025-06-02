package com.example.backendhoatuoiuit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginResponseDTO {
    private String token;
    private Integer id;
    private String name;
    private String email;
    private String role;
}
