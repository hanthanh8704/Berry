package com.example.connectdb.dto.response;


import com.example.connectdb.entity.Anh;
import org.springframework.data.rest.core.config.Projection;
@Projection(types = {Anh.class})
public interface ImageResponse {
    Integer getId();
    String getTen();
}
