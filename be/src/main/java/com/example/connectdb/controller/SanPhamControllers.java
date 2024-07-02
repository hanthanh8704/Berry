package com.example.connectdb.controller;

import com.example.connectdb.dto.request.product.SanPhamRequest;
import com.example.connectdb.dto.request.product.SanPhamSearchRequest;
import com.example.connectdb.dto.response.SanPhamReponse;
import com.example.connectdb.entity.SanPham;
import com.example.connectdb.service.SanPhamService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/shirt")
public class SanPhamControllers {
    @Autowired
    private SanPhamService sanPhamService;
//    @GetMapping("/shirt-promotion")
//    public List<SanPhamReponse> getTest(@RequestParam(required = false) Integer promotion){
//        return sanPhamService.getAll(promotion);
//    }

    @GetMapping("/top-sell")
    public List<SanPhamReponse> getTopSell(@RequestParam(required = false, defaultValue = "5") Integer top){
        return sanPhamService.getTopSell(top);
    }

    @GetMapping
    public PageableObject<SanPhamReponse> getAll(SanPhamSearchRequest request) {
        return sanPhamService.getAll(request);
    }

    @GetMapping("/{id}")
    public SanPham getOne(@PathVariable Integer id) {
        return sanPhamService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid SanPhamRequest request) {
        return new ResponseObject(sanPhamService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid SanPhamRequest request){
        return new ResponseObject(sanPhamService.update(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject changeStatus(@PathVariable Long id){
        return new ResponseObject(sanPhamService.changeStatus(id));
    }
}
