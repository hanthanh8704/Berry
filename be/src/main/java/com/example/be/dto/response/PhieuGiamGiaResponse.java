package com.example.be.dto.response;

import com.example.be.entity.PhieuGiamGia;
import org.springframework.data.rest.core.config.Projection;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Projection(types = {PhieuGiamGia.class})
public interface PhieuGiamGiaResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();
    String getMa();
    String getTen();
    Integer getSoLuong();
    Timestamp getNgayBatDau();
    Timestamp getNgayKetThuc();
    Timestamp getNgayTao();
    Timestamp getNgaySua();

    String getNguoiTao();

    String getNguoiSua();

    String getTrangThai();
    BigDecimal getGiaTriToiDa();
    BigDecimal getGiaTriGiam();
    String getKieuGiam();

}
