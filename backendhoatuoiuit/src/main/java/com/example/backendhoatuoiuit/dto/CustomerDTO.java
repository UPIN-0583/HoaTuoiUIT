package com.example.backendhoatuoiuit.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Boolean isActive;
    private String role;
}
