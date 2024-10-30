package com.example.be.dto.admin.response;

import com.example.be.entities.Color;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {Color.class})
public interface ColorResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getName();  // Đổi từ getTen -> getName

    String getStatus();  // Đổi từ getTrangThai -> getStatus

    LocalDateTime getCreatedAt();  // Đổi từ getNgayTao -> getCreatedAt
}
