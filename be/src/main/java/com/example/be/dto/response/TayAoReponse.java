package com.example.connectdb.dto.response;


import com.example.connectdb.entity.TayAo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {TayAo.class})
public interface TayAoReponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getTen();

    String getTrangThai();

    LocalDateTime getNgayTao();
}
