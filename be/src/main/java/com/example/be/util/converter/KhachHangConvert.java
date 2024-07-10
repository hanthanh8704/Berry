package com.example.be.util.converter;

import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.entity.KhachHang;
import com.example.be.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KhachHangConvert {
    @Autowired
    private KhachHangRepository accountRepository;
    public KhachHang convertRequestToEntity(KhachHangRequest request){
        return KhachHang.builder()
                .hoTen(request.getHoTen())
                .gioiTinh(request.getGioiTinh())
                .email(request.getEmail())
                .soDienThoai(request.getSoDienThoai())
                .deleted(request.getDeleted())
                .ngaySinh(request.getNgaySinh())
                .deleted(true)
                .build();
    }

    public KhachHang convertRequestToEntity(Integer id, KhachHangRequest request) {
        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
        KhachHang khachHang = accountRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));
        khachHang.setMa(request.getMa());
        khachHang.setHoTen(request.getHoTen());
        khachHang.setTrangThai(request.getTrangThai());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setNgaySinh(request.getNgaySinh());
        khachHang.setSoDienThoai(request.getSoDienThoai());
        khachHang.setEmail(request.getEmail());
        khachHang.setNgaySua(request.getNgaySua());
        khachHang.setDeleted(request.getDeleted());
        return khachHang;
    }

}

