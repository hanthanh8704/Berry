package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.category.CategoryRequest;
import com.example.be.entities.Category;
import com.example.be.repositories.admin.CategoryRepository;
import com.example.be.services.CategoryService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public PageableObject getAll(CategoryRequest request) {
        return categoryService.getAll(request);
    }

    @GetMapping("/{id}")
    public Category getOne(@PathVariable Integer id) {
        return categoryService.getOne(id);
    }

    @PostMapping("/create")
    public ResponseObject create(@RequestBody @Valid CategoryRequest request) {
        return new ResponseObject(categoryService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid CategoryRequest request) {
        return new ResponseObject(categoryService.update(id, request));
    }
    //Cua Duc
    @Autowired
    CategoryRepository categoryRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Category>> getAllDanhMuc() {
        List<Category> dotGiamGiaList = categoryRepository.findAll();
        return ResponseEntity.ok(dotGiamGiaList);
    }
}
