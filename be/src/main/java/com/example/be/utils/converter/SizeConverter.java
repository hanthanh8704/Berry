package com.example.be.utils.converter;

import com.example.be.dto.admin.request.size.SizeRequest;
import com.example.be.entities.Size;
import org.springframework.stereotype.Component;

@Component
public class SizeConverter {
    public Size convertRequestToEntity(SizeRequest request) {
        Size kichCo = Size.builder()
                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động")
                .build();
        return kichCo;
    }

    public Size convertRequestToEntity(Size entity, SizeRequest request) {
        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        return entity;
    }
}
