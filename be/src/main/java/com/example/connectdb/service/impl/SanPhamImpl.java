package com.example.connectdb.service.impl;

import com.example.connectdb.dto.request.product.SanPhamRequest;
import com.example.connectdb.dto.request.product.SanPhamSearchRequest;
import com.example.connectdb.dto.response.SanPhamReponse;
import com.example.connectdb.entity.SanPham;
import com.example.connectdb.repositories.SanPhamRepository;

import com.example.connectdb.service.SanPhamService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.converter.ProductConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SanPhamImpl implements SanPhamService {
    private final SanPhamRepository sanPhamRepository;
    private final ProductConverter productConverter;

    @Autowired
    public SanPhamImpl(SanPhamRepository sanPhamRepository, ProductConverter productConverter) {
        this.sanPhamRepository = sanPhamRepository;
        this.productConverter = productConverter;
    }

    @Override
    public PageableObject<SanPhamReponse> getAll(SanPhamSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());

        SanPhamSearchRequest customRequest = SanPhamSearchRequest.builder()
                .ten(request.getTen())
                .mauSac(request.getMauSac())
                .kichCo(request.getKichCo())
                .chatLieu(request.getChatLieu())
                .thuongHieu(request.getThuongHieu())
                .tayAo(request.getTayAo())
                .coAo(request.getCoAo())
                .danhMuc(request.getDanhMuc())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .trangThai(request.getTrangThai())
                .build();

        return new PageableObject<>(sanPhamRepository.getAllSanPham(customRequest, pageable));
    }

    @Override
    public SanPham getOne(Integer id) {
        return null;
    }

    @Override
    public SanPham create(SanPhamRequest request) {
        return null;
    }

    @Override
    public SanPham update(Long id, SanPhamRequest request) {
        return null;
    }

    @Override
    public SanPham changeStatus(Long id) {
        return null;
    }

    @Override
    public List<SanPhamReponse> getTopSell(Integer top) {
        return null;
    }
}
