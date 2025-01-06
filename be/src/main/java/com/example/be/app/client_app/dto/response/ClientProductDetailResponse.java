package com.example.be.app.client_app.dto.response;


import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientProductDetailResponse {
    @Value("#{target.id}")
    Integer getId();
    @Value("#{target.size}")
    String getSize();

    String getIdColor();

    BigDecimal getGia();

    String getWeight();

    String getCodeColor();
    String getNameColor();
}
