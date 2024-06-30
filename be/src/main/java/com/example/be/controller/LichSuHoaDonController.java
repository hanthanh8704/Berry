package com.example.be.controller;

import com.example.be.dto.response.LichSuHoaDonResponse;
import com.example.be.service.LichSuHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bill-history")
public class LichSuHoaDonController {
    @Autowired
    private LichSuHoaDonService billHistoryService;
    @GetMapping("/{id}")
    public List<LichSuHoaDonResponse> getByBill(@PathVariable("id") Integer id){
        return billHistoryService.getByBill(id);
    }
}
