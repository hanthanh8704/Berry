package com.example.connectdb.controller;

import com.example.connectdb.dto.request.productDetail.FindShirtDetailRequest;
import com.example.connectdb.service.ChiTietSanPhamService;
import com.example.connectdb.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shoe-detail")
public class ChiTietSanPhamController {

    @Autowired
     private ChiTietSanPhamService chiTietSanPhamService;

    @GetMapping
    public PageableObject getAll(FindShirtDetailRequest request) {
        return chiTietSanPhamService.getAll(request);
    }
}
