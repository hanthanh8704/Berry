package com.example.be.service;

import com.example.be.dto.request.product.SanPhamRequest;
import com.example.be.dto.request.product.SanPhamSearchRequest;
import com.example.be.dto.response.SanPhamReponse;
import com.example.be.entity.SanPham;
import com.example.be.util.common.PageableObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SanPhamService {
    boolean existsByTenIgnoreCase(String ten);
    PageableObject<SanPhamReponse> getAll(SanPhamSearchRequest request);
    SanPham getOne(Integer id);
    SanPham create(SanPhamRequest request);
    SanPham update(Integer id,SanPhamRequest request);
    SanPham changeStatus(Integer id);

    List<SanPhamReponse> getTopSell(Integer top);

    }
