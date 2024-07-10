package com.example.be.dto.response;

import com.example.be.entity.KhachHang;
import org.springframework.data.rest.core.config.Projection;
import com.example.be.entity.DiaChi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Date;
import java.sql.Timestamp;

@Projection(types = {KhachHang.class})
public interface KhachHangResponse {
    Integer getId();
    String getMa();
    String getHoTen();
    String getAnh();
    String getSoDienThoai();
    String getGioiTinh();
    Date getNgaySinh();
    String getEmail();
    String getTrangThai();
    Timestamp getNgayTao();
    Timestamp getNgaySua();
    Boolean getDeleted();
    AccountResponse getAccount();
}
