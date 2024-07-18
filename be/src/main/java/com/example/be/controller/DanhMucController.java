package com.example.be.controller;

import com.example.be.dto.request.category.DanhMucRequest;
import com.example.be.entity.DanhMuc;
import com.example.be.service.DanhMucService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
public class DanhMucController {
    private final DanhMucService danhMucService;

    @Autowired
    public DanhMucController(DanhMucService danhMucService) {
        this.danhMucService = danhMucService;
    }

    @GetMapping
    public PageableObject getAll(DanhMucRequest request) {
        return danhMucService.getAll(request);
    }

    @GetMapping("/{id}")
    public DanhMuc getOne(@PathVariable Integer id) {
        return danhMucService.getOne(id);
    }

    @PostMapping("/create")
    public ResponseObject create(@RequestBody @Valid DanhMucRequest request) {
        return new ResponseObject(danhMucService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid DanhMucRequest request) {
        return new ResponseObject(danhMucService.update(id, request));
    }
}