package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.material.MaterialRequest;
import com.example.be.entities.Material;
import com.example.be.repositories.admin.MaterialRepository;
import com.example.be.services.MaterialService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/material")
public class MaterialController {
    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public PageableObject getAll(MaterialRequest request) {
        return materialService.getAll(request);
    }

    @GetMapping("/{id}")
    public Material getOne(@PathVariable Integer id) {
        return materialService.getOne(id);
    }

    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid MaterialRequest request) {
        return new ResponseObject(materialService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid MaterialRequest request) {
        return new ResponseObject(materialService.update(id, request));
    }

    //Của Đúc
    @Autowired
    private MaterialRepository materialRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Material>> getAllMaterial() {
        List<Material> materials = materialRepository.findAll();
        return ResponseEntity.ok(materials);
    }
}
