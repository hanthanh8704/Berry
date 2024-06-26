package com.example.be.service;

import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.entity.ThanhToan;

import java.util.List;

public interface ThanhToanService {

    List<ThanhToanResponse> getThanhToanByIdHoaDon(Integer idHoaDon);

    List<ThanhToan> findByHoaDonIdAndTenHinhThuc(Integer idHoaDon, String tenHinhThuc);
}