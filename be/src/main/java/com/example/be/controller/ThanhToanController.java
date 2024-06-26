package com.example.be.controller;

import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.service.ThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
