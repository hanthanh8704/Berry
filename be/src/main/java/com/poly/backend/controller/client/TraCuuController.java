package com.poly.backend.controller.client;

import com.poly.backend.dto.request.hoadon.HoaDonRequest;

import com.poly.backend.entity.English.Bill;

import com.poly.backend.service.client.GioHangService;
import com.poly.backend.service.client.TraCuuService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/tra-cuu")
public class TraCuuController {
    @Autowired
    private TraCuuService traCuuService;

    @GetMapping("detail/{code}")
    public HoaDonRequest detailHoaDon(@PathVariable String code) {  // Đổi từ idDC thành idHD
        HoaDonRequest hoaDonRequest = traCuuService.detailHoaDon(code);
        return hoaDonRequest;
    }

    @GetMapping("hoa-don")
    public Bill findByMaAndSDT(@RequestParam String code, @RequestParam String recipientPhone) {
        Bill hoaDon = traCuuService.findByMaAndSDT(code, recipientPhone);
        return hoaDon;
    }

}
