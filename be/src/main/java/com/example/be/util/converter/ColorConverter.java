package com.example.be.util.converter;


import com.example.be.dto.request.color.MauSacRequest;
import com.example.be.entity.MauSac;
import org.springframework.stereotype.Component;

@Component
public class ColorConverter {
    public MauSac convertRequestToEntity(MauSacRequest request) {
        MauSac mauSac = MauSac.builder()
                .code(request.getCode())
                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return mauSac;
    }

    public MauSac convertRequestToEntity(MauSac entity, MauSacRequest request) {
        entity.setCode(request.getCode());
        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }

}
