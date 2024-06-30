package com.example.be.dto.response;

import com.example.be.entity.HoaDon;
import com.example.be.entity.LichSuHoaDon;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Projection(types = {LichSuHoaDon.class})
public interface LichSuHoaDonResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getIdHoaDon();
    String getHoaDon();
    String getNhanVien();
    Integer getId();
    String getGhiChu();
    String getTrangThai();
    Timestamp getNgayTao();
    Timestamp getNgaySua();
}
