package com.example.be.dto.response;

import com.example.be.entity.ThuongHieu;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {ThuongHieu.class})
public interface ThuongHieuResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getTen();

    String getTrangThai();

    LocalDateTime getNgayTao();
}
