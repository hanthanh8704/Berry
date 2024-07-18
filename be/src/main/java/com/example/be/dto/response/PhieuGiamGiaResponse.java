package com.example.be.dto.response;

import com.example.be.entity.PhieuGiamGia;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
/**
 * @author ninhncph40535
 *
 */
@Projection(types = {PhieuGiamGia.class})
public interface PhieuGiamGiaResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();
    String getMa();
    String getTen();
    String getLoai();
    Integer getSoLuong();
    LocalDateTime getNgayBatDau();
    LocalDateTime getNgayKetThuc();
    String getTrangThai();
    String getHinhThucGiam();
    BigDecimal getGiaTriHoaDonDuocGiam();
    BigDecimal getGiaTriHoaDonDuocApDung();
    String getCustomers();

}
