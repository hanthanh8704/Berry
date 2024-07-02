package com.example.connectdb.util.converter;

import com.example.connectdb.dto.request.color.MauSacRequest;
import com.example.connectdb.dto.request.product.SanPhamRequest;
import com.example.connectdb.entity.MauSac;
import com.example.connectdb.entity.SanPham;
import org.springframework.stereotype.Component;

@Component
public class ProductConverter {
    public SanPham convertRequestToEntity(SanPhamRequest request){
        SanPham sanPham = SanPham.builder()

                .ten(request.getTenSanPham())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return sanPham;
    }
    public SanPham convertRequestToEntity(SanPham entity, SanPhamRequest request){

        entity.setTen(request.getTenSanPham());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }
}
