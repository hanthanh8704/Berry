package com.example.be.utils.converter;

import com.example.be.dto.admin.request.product.ShirtRequest;
import com.example.be.dto.admin.request.productDetail.ShirtDetailRequest;
import com.example.be.repositories.admin.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.example.be.entities.*;
@Component
public class ProductConverter {

    @Autowired
    private CategoryRepository categoryRepository;

    public Product convertRequestToEntity(ShirtRequest request) {
        if (request.getCategory() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }

        Category danhMuc = categoryRepository.findById(request.getCategory())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));

        return Product.builder()
                .code(request.getCode())
                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động")
                .category(danhMuc)
                .build();
    }

    public Product convertRequestToEntity(Product entity, ShirtRequest request) {
        if (request.getCategory() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }

        Category danhMuc = categoryRepository.findById(request.getCategory())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));

        entity.setCode(request.getCode());
        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        entity.setCategory(danhMuc);

        return entity;
    }

    public ProductDetail convertRequestToEntityFast(ProductDetail entity, ShirtDetailRequest request) {
        entity.setPrice(request.getPrice());
        entity.setQuantity(request.getQuantity());
        return entity;
    }
}
