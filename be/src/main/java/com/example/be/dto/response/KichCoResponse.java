package com.example.be.dto.response;

import com.example.be.entity.MauSac;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {MauSac.class})
public interface KichCoResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getTen();

    String getTrangThai();

    LocalDateTime getNgayTao();
}
