package com.example.connectdb.controller;


import com.example.connectdb.dto.request.label.ThuongHieuRequest;
import com.example.connectdb.entity.ThuongHieu;
import com.example.connectdb.service.ThuongHieuService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/brand")
public class ThuongHieuController {
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
