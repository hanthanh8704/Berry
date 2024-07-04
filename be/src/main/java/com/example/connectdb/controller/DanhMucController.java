package com.example.connectdb.controller;

import com.example.connectdb.dto.request.category.DanhMucRequest;
import com.example.connectdb.dto.request.material.ChatLieuRequest;
import com.example.connectdb.entity.DanhMuc;
import com.example.connectdb.entity.MauSac;
import com.example.connectdb.service.DanhMucService;
import com.example.connectdb.service.MauSacService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
