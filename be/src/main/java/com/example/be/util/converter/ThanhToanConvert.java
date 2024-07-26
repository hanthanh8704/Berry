package com.example.be.util.converter;

import com.example.be.dto.request.ThanhToanRequest;
import com.example.be.entity.ThanhToan;
import com.example.be.repository.HoaDonRepository;
import com.example.be.repository.ThanhToanRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ThanhToanConvert {
    @Autowired
    private ThanhToanRespository repository;
    @Autowired
    private HoaDonRepository hoaDonRepository;
    public ThanhToan convertRequestToEntity(ThanhToanRequest request){
        return ThanhToan.builder()
                .tenHinhThuc(request.getTenPhuongThuoc())
                .tongTienThanhToan(request.getTongTien())
                .ghiChu(request.getGhiChu())
                .ma_giao_dich(request.getMaGiaoDich())
                .hoaDon(hoaDonRepository.findById(request.getHoaDon()).orElse(null))
                .build();
    }
}
