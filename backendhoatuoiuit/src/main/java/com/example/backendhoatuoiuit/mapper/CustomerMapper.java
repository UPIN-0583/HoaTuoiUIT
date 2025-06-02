package com.example.backendhoatuoiuit.mapper;

import com.example.backendhoatuoiuit.dto.CustomerDTO;
import com.example.backendhoatuoiuit.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setIsActive(customer.getIsActive());
        dto.setRole(customer.getRole());
        return dto;
    }

    public Customer toEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setIsActive(dto.getIsActive());
        customer.setRole(dto.getRole());
        // Chưa set password ở đây
        return customer;
    }
}
