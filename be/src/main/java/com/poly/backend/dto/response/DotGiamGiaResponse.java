package com.poly.backend.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface DotGiamGiaResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getMa();

    String getTen();


    Integer getGiaTriGiam();

    String getTrangThai();


    LocalDateTime getNgayBatDau();


    LocalDateTime getNgayKetThuc();

    Boolean getDeleted();
}
