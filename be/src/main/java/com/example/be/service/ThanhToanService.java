package com.example.be.service;

import com.example.be.dto.request.ThanhToanRequest;
import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.entity.ThanhToan;
import com.example.be.util.common.ResponseObject;

import java.util.List;

public interface ThanhToanService {

    List<ThanhToanResponse> getThanhToanByIdHoaDon(Integer idHoaDon);
    ResponseObject create(ThanhToanRequest request);

    List<ThanhToan> findByHoaDonIdAndTenHinhThuc(Integer idHoaDon, String tenHinhThuc);
}