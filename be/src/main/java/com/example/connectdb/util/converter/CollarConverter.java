package com.example.connectdb.util.converter;

import com.example.connectdb.dto.request.collar.CoAoRequest;
import com.example.connectdb.entity.CoAo;
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
