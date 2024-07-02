package com.example.connectdb.util.converter;

import com.example.connectdb.dto.request.color.MauSacRequest;
import com.example.connectdb.dto.request.sleeve.TayAoRequest;
import com.example.connectdb.entity.MauSac;
import com.example.connectdb.entity.TayAo;
import org.springframework.stereotype.Component;

@Component
public class SleeveConverter {
    public TayAo convertRequestToEntity(TayAoRequest request) {
        TayAo tayAo = TayAo.builder()

                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return tayAo;
    }

    public TayAo convertRequestToEntity(TayAo entity, TayAoRequest request) {

        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }

}
