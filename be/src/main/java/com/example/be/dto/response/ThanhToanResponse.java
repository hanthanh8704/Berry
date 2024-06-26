package com.example.be.dto.response;

import com.example.be.entity.HoaDon;
import com.example.be.entity.LichSuHoaDon;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Projection(types = {ThanhToanResponse.class})
public interface ThanhToanResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    String getMaGiaoDich();
    Integer getId();
    String getTenHinhThuc();
    BigDecimal getTongTienThanhToan();
    String getGhiChu();
    String getTrangThai();
    Timestamp getNgayTao();
    String getNguoiTao();
}
