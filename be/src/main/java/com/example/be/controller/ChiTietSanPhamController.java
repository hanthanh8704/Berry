package com.example.be.controller;

import com.example.be.dto.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.request.productDetail.ShirtDetailRequest;
import com.example.be.dto.request.productDetail.UpdateShirtDetailRequest;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.service.ChiTietSanPhamService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shirt-detail")
public class ChiTietSanPhamController {

    @Autowired
    private ChiTietSanPhamService shoeDetailService;

    @GetMapping
    public PageableObject getAll(FindShirtDetailRequest request) {
        return shoeDetailService.getAll(request);
    }

    @GetMapping("/{id}")
    public ChiTietSanPham getOne(@PathVariable Integer id) {
        return shoeDetailService.getOne(id);
    }

    @GetMapping("/get-one/{id}")
    public ResponseObject getOneShoeDetail(@PathVariable Integer id) {
        return new ResponseObject(shoeDetailService.getOneShoeDetail(id));
    }

    @GetMapping("/find-min-max-price")
    public Map<String, BigDecimal> findMinAndMaxPrice() {
        return shoeDetailService.findMinAndMaxPrice();
    }

    @PostMapping
    public ResponseObject create(@RequestBody List<ShirtDetailRequest> list) {
        return new ResponseObject(shoeDetailService.create(list));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid UpdateShirtDetailRequest request) {
        return new ResponseObject(shoeDetailService.update(id, request));
    }

    @PutMapping("/update-fast")
    public ResponseObject updateFast(@RequestBody List<ShirtDetailRequest> list) {
        list.forEach(request -> System.out.println(request));
        return new ResponseObject(shoeDetailService.updateFast(list));
    }
}
