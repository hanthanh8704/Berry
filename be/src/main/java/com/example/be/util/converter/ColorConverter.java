package com.example.connectdb.util.converter;


import com.example.connectdb.dto.request.color.MauSacRequest;
import com.example.connectdb.entity.MauSac;
import org.springframework.stereotype.Component;

@Component
public class ColorConverter {
    public MauSac convertRequestToEntity(MauSacRequest request) {
        MauSac mauSac = MauSac.builder()

                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return mauSac;
    }

    public MauSac convertRequestToEntity(MauSac entity, MauSacRequest request) {

        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }

}
