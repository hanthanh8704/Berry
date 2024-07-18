package com.example.be.util.converter;

import com.example.be.dto.request.collar.CoAoRequest;
import com.example.be.entity.CoAo;
import org.springframework.stereotype.Component;

@Component
public class CollarConverter {

    public CoAo convertRequestToEntity(CoAoRequest request) {
        CoAo coAo = new CoAo();
        coAo.setTen(request.getTen());
        coAo.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return coAo;
    }

    public CoAo convertRequestToEntity(CoAo entity, CoAoRequest request) {
        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }
}
