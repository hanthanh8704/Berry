package com.example.be.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;

public interface  DotGiamGiaResponse {
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
