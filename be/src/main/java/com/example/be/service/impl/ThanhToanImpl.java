package com.example.be.service.impl;

import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.entity.ThanhToan;
import com.example.be.repository.ThanhToanRespository;
import com.example.be.service.ThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ThanhToanImpl implements ThanhToanService {
    private final ThanhToanRespository thanhToanRepository;

    @Autowired
    public ThanhToanImpl(ThanhToanRespository thanhToanRepository) {
        this.thanhToanRepository = thanhToanRepository;
    }

    @Override
    public List<ThanhToanResponse> getThanhToanByIdHoaDon(Integer idHoaDon) {
        return thanhToanRepository.getThanhToanByIdHoaDon(idHoaDon);
    }

    @Override
    public List<ThanhToan> findByHoaDonIdAndTenHinhThuc(Integer idHoaDon, String tenHinhThuc) {
        return thanhToanRepository.findByHoaDonIdAndTenHinhThuc(idHoaDon, tenHinhThuc);
    }
}
