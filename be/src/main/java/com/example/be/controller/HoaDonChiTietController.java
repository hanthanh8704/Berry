package com.example.be.controller;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.HoaDonChiTiet;
import com.example.be.service.HoaDonChiTietService;
import com.example.be.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bill-detail")
public class HoaDonChiTietController {
    private final HoaDonChiTietService hoaDonChiTietService;

    @Autowired
    public HoaDonChiTietController(HoaDonChiTietService hoaDonChiTietService) {
        this.hoaDonChiTietService = hoaDonChiTietService;
    }

    @GetMapping
    public PageableObject<HoaDonChiTietResponse> getAll(BillDetailRequest request) {
        return hoaDonChiTietService.getAll(request);
    }

    @GetMapping("/{id}")
    public HoaDonChiTiet getOne(@PathVariable Integer id) {
        return hoaDonChiTietService.getOne(id);
    }

}
