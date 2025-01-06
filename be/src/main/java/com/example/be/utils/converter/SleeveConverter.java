package com.example.be.utils.converter;

import com.example.be.dto.admin.request.sleeve.SleeveRequest;
import com.example.be.entities.Sleeve;
import org.springframework.stereotype.Component;

@Component
public class SleeveConverter {
    public Sleeve convertRequestToEntity(SleeveRequest request) {
        Sleeve tayAo = Sleeve.builder()

                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động")
                .build();
        return tayAo;
    }

    public Sleeve convertRequestToEntity(Sleeve entity, SleeveRequest request) {

        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        return entity;
    }

}
