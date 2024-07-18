package com.example.be.service;

import com.example.be.dto.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.request.productDetail.ShirtDetailRequest;
import com.example.be.dto.request.productDetail.UpdateShirtDetailRequest;
import com.example.be.dto.response.ShirtDetailResponse;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ChiTietSanPhamService {
    PageableObject<ShirtDetailResponse> getAll(FindShirtDetailRequest request);

    ChiTietSanPham getOne(Integer id);

    String create(List<ShirtDetailRequest> list);

    ChiTietSanPham update(Integer id, UpdateShirtDetailRequest request);

    ChiTietSanPham delete(Integer id);

    ResponseObject updateFast(List<ShirtDetailRequest> list);

    Map<String, BigDecimal> findMinAndMaxPrice();

    ShirtDetailResponse getOneShoeDetail(Integer id);
}
