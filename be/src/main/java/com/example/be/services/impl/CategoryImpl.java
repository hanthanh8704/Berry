package com.example.be.services.impl;

import com.example.be.dto.admin.request.category.CategoryRequest;
import com.example.be.dto.admin.response.CategoryResponse;
import com.example.be.entities.Category;
import com.example.be.repositories.admin.CategoryRepository;
import com.example.be.services.CategoryService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.CategoryConverter;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CategoryImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Autowired
    private CategoryConverter categoryConverter;

    @Override
    public PageableObject<CategoryResponse> getAll(CategoryRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(categoryRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public Category getOne(Integer id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Danh mục " + request.getName() + " đã tồn tại!");
        }
        Category category = categoryConverter.convertRequestToEntity(request);
        return categoryRepository.save(category);
    }

    @Override
    public Category update(Integer id, CategoryRequest request) {
        Category oldCategory = categoryRepository.findById(id).get();
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldCategory.getName().equals(request.getName())) {
                return categoryRepository.save(categoryConverter.convertRequestToEntity(oldCategory, request));
            }
            throw new RestApiException("Danh mục " + request.getName() + " đã tồn tại!");
        } else {
            return categoryRepository.save(categoryConverter.convertRequestToEntity(oldCategory, request));
        }
    }
}
