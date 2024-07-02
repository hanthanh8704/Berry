package com.example.connectdb.service;

import com.example.connectdb.dto.request.product.SanPhamRequest;
import com.example.connectdb.dto.request.product.SanPhamSearchRequest;
import com.example.connectdb.dto.response.SanPhamReponse;
import com.example.connectdb.entity.SanPham;
import com.example.connectdb.util.common.PageableObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SanPhamService {
    PageableObject<SanPhamReponse> getAll(SanPhamSearchRequest request);
    SanPham getOne(Integer id);
    SanPham create(SanPhamRequest request);
    SanPham update(Long id,SanPhamRequest request);
    SanPham changeStatus(Long id);
//
//    List<ShoePromotionResponse> getAllShoeInPromotion(Long promotion);
    List<SanPhamReponse> getTopSell(Integer top);

    }
