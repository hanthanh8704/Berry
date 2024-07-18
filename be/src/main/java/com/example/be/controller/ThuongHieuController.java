package com.example.be.controller;

import com.example.be.dto.request.label.ThuongHieuRequest;
import com.example.be.entity.ThuongHieu;
import com.example.be.repository.ThuongHieuRepository;
import com.example.be.service.ThuongHieuService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/brand")
public class ThuongHieuController {
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    @GetMapping("/thuong-hieu")
    public ResponseEntity<List<ThuongHieu>> findAllThuongHieu() {
        List<ThuongHieu> thuongHieuList = thuongHieuRepository.findAll();
        return ResponseEntity.ok(thuongHieuList);
    }

    private final ThuongHieuService thuongHieuService;

    @Autowired
    public ThuongHieuController(ThuongHieuService thuongHieuService) {
        this.thuongHieuService = thuongHieuService;
    }

    @GetMapping
    public PageableObject getAll(ThuongHieuRequest request) {
        return thuongHieuService.getAll(request);
    }

    @GetMapping("/{id}")
    public ThuongHieu getOne(@PathVariable Integer id) {
        return thuongHieuService.getOne(id);
    }

    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid ThuongHieuRequest request) {
        return new ResponseObject(thuongHieuService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid ThuongHieuRequest request) {
        return new ResponseObject(thuongHieuService.update(id, request));
    }


}
