package com.example.be.controller;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.HoaDonChiTiet;
import com.example.be.service.HoaDonChiTietService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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

    // Hàm này dùng để lấy ra danh sách hóa đơn chi tiết theo id hóa đơn
    @GetMapping("/hoaDon/{idHoaDon}")
    public List<HoaDonChiTiet> findByHoaDonId(@PathVariable Integer idHoaDon) {
        return hoaDonChiTietService.findByHoaDonId(idHoaDon);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(hoaDonChiTietService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(hoaDonChiTietService.update(id, request));
    }

    @GetMapping("/update-quantity/{id}")
    public ResponseObject updateQuantity(@PathVariable Integer id, @RequestParam(required = false, defaultValue = "0") Integer newQuantity, @RequestParam BigDecimal donGia) {
        return new ResponseObject(hoaDonChiTietService.updateSoLuong(id, newQuantity, donGia));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Integer id){
        return new ResponseObject(hoaDonChiTietService.delete(id));
    }
}
