package com.example.be.controller;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.dto.request.bill.HoaDonSearchRequest;
import com.example.be.dto.response.TKHoaDonTrangThai;
import com.example.be.entity.HoaDon;
import com.example.be.service.HoaDonService;
import com.example.be.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/bill")
public class HoaDonController {
    private final HoaDonService hoaDonService;

    @Autowired
    public HoaDonController(HoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }

    // Hiển thị các danh sách hóa đơn
    @GetMapping
    public PageableObject getAll(HoaDonSearchRequest request) {
        return hoaDonService.getAll(request);
    }

    // Hàm này dùng để hiển thị những danh sách hóa đơn theo trạng thái
    @GetMapping("/statistic-bill-status")
    public List<TKHoaDonTrangThai> getListHoaDonByTrangThai() {
        return hoaDonService.getHoaDonByTrangThai();
    }

    // Hàm này hiển thị detail của hóa đơn
    @GetMapping("/{id}")
    public HoaDon getOne(@PathVariable Integer id) {
        return hoaDonService.getOne(id);
    }


}
