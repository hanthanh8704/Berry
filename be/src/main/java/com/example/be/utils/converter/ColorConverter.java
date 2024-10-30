package com.example.be.utils.converter;


import com.example.be.dto.admin.request.color.ColorRequest;
import com.example.be.entities.Color;
import org.springframework.stereotype.Component;

@Component
public class ColorConverter {
    public Color convertRequestToEntity(ColorRequest request) {
        Color mauSac = Color.builder()

                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động")
                .build();
        return mauSac;
    }

    public Color convertRequestToEntity(Color entity, ColorRequest request) {

        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        return entity;
    }

}
