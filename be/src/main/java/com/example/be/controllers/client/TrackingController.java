package com.example.be.controllers.client;

import com.example.be.dto.client.request.BillRequestClient;
import com.example.be.entities.Bill;
import com.example.be.services.client.TrackingService;
import lombok.AllArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/tra-cuu")
public class TrackingController {

    private TrackingService traCuuService;

    @GetMapping("detail/{code}")
    public BillRequestClient detailHoaDon(@PathVariable String code) {  // Đổi từ idDC thành idHD
        BillRequestClient hoaDonRequest = traCuuService.detailHoaDon(code);
        return hoaDonRequest;
    }

    @GetMapping("hoa-don")
    public Bill findByMaAndSDT(@RequestParam String code, @RequestParam String recipientPhone) {
        Bill hoaDon = traCuuService.findByMaAndSDT(code, recipientPhone);
        return hoaDon;
    }
}
