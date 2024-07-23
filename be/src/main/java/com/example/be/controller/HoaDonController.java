package com.example.be.controller;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.dto.request.bill.HoaDonSearchRequest;
import com.example.be.dto.response.TKHoaDonTrangThai;
import com.example.be.entity.HoaDon;
import com.example.be.service.HoaDonService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Hàm này dùng để thống kê danh trạng thái hóa đơn
    @GetMapping("/statistic-bill-status")
    public List<TKHoaDonTrangThai> getListHoaDonByTrangThai() {
        return hoaDonService.getHoaDonByTrangThai();
    }

    @GetMapping ("/new-bill")
    public List<HoaDon> getNewBill(HoaDonSearchRequest request){
        return hoaDonService.getNewHoaDon(request);
    }

    // Hàm này hiển thị detail của hóa đơn
    @GetMapping("/{id}")
    public HoaDon getOne(@PathVariable Integer id) {
        return hoaDonService.getOne(id);
    }
    // Hàm này dùng để xuất file pdf

    // Hàm này dùng để tạo mới một hóa đơn
    @PostMapping
    public ResponseEntity<HoaDon> create(@RequestBody HoaDonRequest request) {
        return ResponseEntity.ok(hoaDonService.create());
    }

    // Hàm này này dùng để tạo 1 đơn đặt hag
    @PostMapping("/order/{id}")
    public ResponseEntity<HoaDon> createOrder(@RequestBody HoaDonRequest request) {
        return ResponseEntity.ok(hoaDonService.create());
    }
    @PutMapping("/{id}")
    public ResponseObject orderBill(@PathVariable Integer id, @RequestBody @Valid HoaDonRequest request) {
        return new ResponseObject(hoaDonService.orderBill(id, request));
    }

    // Hàm này dùng để thay đổi trạng thái của một hóa đơn.
    public ResponseObject changeStatus(@PathVariable Integer id, @RequestParam String ghiChu, @RequestParam(defaultValue = "false") String trangThai) {
        return new ResponseObject(hoaDonService.changeStatus(id, ghiChu,trangThai));
    }

    // Hàm này dùng để thay đổi thông tin khách hàng của một hóa đơn.


}
