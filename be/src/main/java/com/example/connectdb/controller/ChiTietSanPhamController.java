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
//
//    @GetMapping("/{id}")
//    public ShoeDetail getOne(@PathVariable Long id) {
//        return shoeDetailService.getOne(id);
//    }
//
//    @GetMapping("/get-one/{id}")
//    public ResponseObject getOneShoeDetail(@PathVariable Long id){
//        return new ResponseObject(shoeDetailService.getOneShoeDetail(id));
//    }
//
//
//
//    @PostMapping
//    public ResponseObject create(@RequestBody List<ShoeDetailRequest> list) {
//        return new ResponseObject(shoeDetailService.create(list));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid UpdateShoeDetailRequest request) {
//        return new ResponseObject(shoeDetailService.update(id, request));
//    }
}
