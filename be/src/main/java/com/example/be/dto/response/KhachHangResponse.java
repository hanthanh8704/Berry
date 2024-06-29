package com.example.be.dto.response;

import com.example.be.entity.KhachHang;
import com.example.be.entity.PhieuGiamGia;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {KhachHang.class})
public interface KhachHangResponse {
    Integer getId();
    String getHoTen();
    String getSoDienThoai();
    String getGioiTinh();
    String getEmail();
}
