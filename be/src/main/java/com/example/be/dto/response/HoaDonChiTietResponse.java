package com.example.be.dto.response;

import com.example.be.entity.HoaDonChiTiet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Projection(types = {HoaDonChiTiet.class})
public interface HoaDonChiTietResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getId();
    String getName();
    String getMaSPCT();
    String getMauSac();
    String getKichCo();
    String getChatLieu();
    String getThuongHieu();
    BigDecimal getGia();
    String getAnh();
    Integer getSoLuong();
    String getTrangThai();
    Timestamp getNgayTao();
    Timestamp getNgaySua();
    String getNguoiTao();
    String getNguoiSua();
}
