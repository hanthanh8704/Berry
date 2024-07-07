package com.example.connectdb.util.converter;

import com.example.connectdb.dto.request.product.SanPhamRequest;
import com.example.connectdb.entity.DanhMuc;
import com.example.connectdb.entity.SanPham;
import com.example.connectdb.repositories.DanhMucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductConverter {

    @Autowired
    private DanhMucRepository danhMucRepository;

    public SanPham convertRequestToEntity(SanPhamRequest request) {
        if (request.getDanhMuc() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }

        DanhMuc danhMuc = danhMucRepository.findById(request.getDanhMuc())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));

        return SanPham.builder()
                .ma(request.getMa())
                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .danhMuc(danhMuc)
                .build();
    }

    public SanPham convertRequestToEntity(SanPham entity, SanPhamRequest request) {
        if (request.getDanhMuc() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }

        DanhMuc danhMuc = danhMucRepository.findById(request.getDanhMuc())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));

        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        entity.setDanhMuc(danhMuc);

        return entity;
    }
}
