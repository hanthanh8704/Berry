package com.example.connectdb.dto.response;

import com.example.connectdb.entity.MauSac;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {MauSac.class})
public interface MauSacResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getTen();

    String getTrangThai();

    LocalDateTime getNgayTao();
}
