package com.example.connectdb.service.impl;

import com.example.connectdb.dto.request.productDetail.FindShirtDetailRequest;
import com.example.connectdb.dto.request.productDetail.ShirtDetailRequest;
import com.example.connectdb.dto.request.productDetail.UpdateShirtDetailRequest;
import com.example.connectdb.dto.response.ShirtDetailResponse;
import com.example.connectdb.entity.ChiTietSanPham;
import com.example.connectdb.repositories.*;
import com.example.connectdb.service.ChiTietSanPhamService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class ChiTietSanPhamImpl  implements ChiTietSanPhamService {

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

//    @Autowired
//    private ShoeDetailConvert shoeDetailConvert;
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private KichCoRepository kichCoRepository;
    @Autowired
    private ChatLieuRepository chatLieuRepository;
    @Override
    public PageableObject<ShirtDetailRequest> getAll(FindShirtDetailRequest request) {
        return null;
    }

    @Override
    public ChiTietSanPham getOne(Integer id) {
        return null;
    }

    @Override
    public String create(List<ShirtDetailRequest> list) {
        return null;
    }

    @Override
    public ChiTietSanPham update(Integer id, UpdateShirtDetailRequest request) {
        return null;
    }

    @Override
    public ChiTietSanPham delete(Long id) {
        return null;
    }

    @Override
    public ResponseObject updateFast(List<ShirtDetailRequest> list) {
        return null;
    }

    @Override
    public Map<String, BigDecimal> findMinAndMaxPrice() {
        return null;
    }

    @Override
    public ShirtDetailResponse getOneShoeDetail(Long id) {
        return null;
    }
}
