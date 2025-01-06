package com.example.be.utils.converter;

import com.example.be.dto.admin.request.collar.CollarRequest;
import com.example.be.entities.Collar;
import org.springframework.stereotype.Component;

@Component
public class CollarConverter {

    public Collar convertRequestToEntity(CollarRequest request) {
        Collar coAo = Collar.builder()
                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : " Đang Hoạt động")
                .build();
        return coAo;
    }

    public Collar convertRequestToEntity(Collar entity, CollarRequest request) {
        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        return entity;
    }
}
