package com.example.be.dto.response;

import com.example.be.entity.HoaDon;
import com.example.be.entity.KhachHang;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Timestamp;

@Projection(types = {KhachHang.class})
public interface KhachHangResponse {
    @Value("#{target.indexs}")
    Integer getInteger();
    Integer getId();
    String getMa();
    String getHoTen();
    String getGioiTinh();
    String getSoDienThoai();
    String getEmail();
    String getTaiKhoan();
    String getTrangThai();
    Timestamp getNgayTao();
    Timestamp getNgaySua();
}
