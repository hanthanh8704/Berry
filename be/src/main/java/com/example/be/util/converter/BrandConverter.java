package com.example.be.util.converter;

import com.example.be.dto.request.label.ThuongHieuRequest;
import com.example.be.entity.ThuongHieu;
import org.springframework.stereotype.Component;

@Component
public class BrandConverter {
    public ThuongHieu convertRequestToEntity(ThuongHieuRequest request) {
        ThuongHieu thuongHieu = ThuongHieu.builder()
                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return thuongHieu;
    }

    public ThuongHieu convertRequestToEntity(ThuongHieu entity, ThuongHieuRequest request) {
        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }

}
