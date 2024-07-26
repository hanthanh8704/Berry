package com.example.be.controller;

import com.example.be.dto.request.ThanhToanRequest;
import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.service.ThanhToanService;
import com.example.be.util.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-method")
public class ThanhToanController {
    @Autowired
    private ThanhToanService thanhToanService;

    @GetMapping("/{id}")
    public List<ThanhToanResponse> getAll(@PathVariable Integer id){
        return thanhToanService.getThanhToanByIdHoaDon(id);
    }
    @PostMapping
    public ResponseObject create(@RequestBody ThanhToanRequest request){
        return thanhToanService.create(request);
    }
}
