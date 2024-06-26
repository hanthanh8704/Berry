package com.example.be.service;

import com.example.be.dto.response.LichSuHoaDonResponse;

import java.util.List;

public interface LichSuHoaDonService {
    List<LichSuHoaDonResponse> getByBill(Integer idHoaDon);
}
