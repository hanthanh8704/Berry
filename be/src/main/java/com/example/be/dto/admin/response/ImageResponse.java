package com.example.be.dto.admin.response;


import com.example.be.entities.Image;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Image.class})
public interface ImageResponse {
    Integer getId();

    String getUrl();
}
