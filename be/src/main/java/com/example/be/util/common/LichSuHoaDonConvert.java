package com.example.be.util.common;

import com.example.be.dto.request.billHistory.BillHistoryRequest;
import com.example.be.entity.LichSuHoaDon;
import com.example.be.entity.NhanVien;
import com.example.be.repository.HoaDonRepository;
import com.example.be.repository.LichSuHoaDonRepository;
import com.example.be.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LichSuHoaDonConvert {
    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private NhanVienRepository nhanVienRepository;

    public LichSuHoaDon convertRequestToEntity(BillHistoryRequest request){
        return LichSuHoaDon.builder()
                .hoaDon(hoaDonRepository.findById(request.getIdHoaDon()).get())
                .nhanVien(nhanVienRepository.findById(request.getIdNhanVien()).get())
                .ghiChu(request.getGhiChu())
                .trangThai(request.getTrangThai())
                .build();
    }
}
