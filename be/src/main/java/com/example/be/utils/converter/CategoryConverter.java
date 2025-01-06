package com.example.be.utils.converter;


import com.example.be.dto.admin.request.category.CategoryRequest;
import com.example.be.entities.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryConverter {

    public Category convertRequestToEntity(CategoryRequest request) {
        Category danhMuc = Category.builder()
                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : " Đang Hoạt động")
                .build();
        return danhMuc;
    }

    public Category convertRequestToEntity(Category entity, CategoryRequest request) {
        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        return entity;
    }
}
