package com.example.be.util.converter;


import com.example.be.dto.request.category.DanhMucRequest;
import com.example.be.entity.DanhMuc;
import org.springframework.stereotype.Component;

@Component
public class CategoryConverter {

    public DanhMuc convertRequestToEntity(DanhMucRequest request) {
        DanhMuc danhMuc = DanhMuc.builder()
                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return danhMuc;
    }

    public DanhMuc convertRequestToEntity(DanhMuc entity, DanhMucRequest request) {
        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }
}
