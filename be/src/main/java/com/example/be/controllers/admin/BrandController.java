package com.example.be.controllers.admin;


import com.example.be.dto.admin.request.brand.BrandRequest;
import com.example.be.entities.Brand;
import com.example.be.repositories.admin.BrandRepository;
import com.example.be.services.BrandService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/brand")
public class BrandController {
    private final BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public PageableObject getAll(BrandRequest request) {
        return brandService.getAll(request);
    }

    @GetMapping("/{id}")
    public Brand getOne(@PathVariable Integer id) {
        return brandService.getOne(id);
    }

    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid BrandRequest request) {
        return new ResponseObject(brandService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid BrandRequest request) {
        return new ResponseObject(brandService.update(id, request));
    }

    //Của Đúc
    @Autowired
    private BrandRepository brandRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Brand>> getAllMaterial() {
        List<Brand> brands = brandRepository.findAll();
        return ResponseEntity.ok(brands);
    }
}
