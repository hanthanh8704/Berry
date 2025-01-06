package com.example.be.utils.converter;

import com.example.be.dto.admin.request.brand.BrandRequest;
import com.example.be.entities.Brand;
import org.springframework.stereotype.Component;

@Component
public class BrandConverter {
    public Brand convertRequestToEntity(BrandRequest request) {
        Brand brand = Brand.builder()
                .name(request.getName()) // Changed from 'ten' to 'name'
                .status(request.getStatus() != null ? request.getStatus() : " Đang Hoạt động")
                .build();
        return brand;
    }

    public Brand convertRequestToEntity(Brand entity, BrandRequest request) {
        entity.setName(request.getName()); // Changed from 'setTen' to 'setName'
        entity.setStatus(request.getName() != null ? request.getName() : "Đang Hoạt động"); // Changed from 'setTrangThai' to 'setStatus'
        return entity;
    }

}
