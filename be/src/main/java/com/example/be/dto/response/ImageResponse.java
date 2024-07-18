package com.example.be.dto.response;


import com.example.be.entity.Anh;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Anh.class})
public interface ImageResponse {
    Integer getId();

    String getTen();
}
