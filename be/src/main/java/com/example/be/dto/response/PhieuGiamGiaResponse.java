package com.example.be.dto.response;

import com.example.be.entity.PhieuGiamGia;
import org.springframework.data.rest.core.config.Projection;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Projection(types = {PhieuGiamGia.class})
public interface PhieuGiamGiaResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();
    String getMa();
    String getTen();
    String getLoai();
    Integer getSoLuong();
    Timestamp getNgayBatDau();
    Timestamp getNgayKetThuc();
    String getTrangThai();
    String getKieuGiam();
    BigDecimal getGiaTriGiam();
    BigDecimal getGiaTriToiDa();
    String getCustomer();

}
