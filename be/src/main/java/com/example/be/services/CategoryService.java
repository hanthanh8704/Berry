package com.example.be.services;

import com.example.be.dto.admin.request.category.CategoryRequest;
import com.example.be.dto.admin.response.CategoryResponse;
import com.example.be.entities.Category;
import com.example.be.utils.common.PageableObject;

public interface CategoryService {
    PageableObject<CategoryResponse> getAll(CategoryRequest request);

    Category getOne(Integer id);

    Category create(CategoryRequest categoryRequest);

    Category update(Integer id, CategoryRequest categoryRequest);
}
