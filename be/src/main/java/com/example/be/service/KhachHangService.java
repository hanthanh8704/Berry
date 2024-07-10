package com.example.be.service;

import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.entity.KhachHang;
import com.example.be.util.common.PageableObject;


public interface KhachHangService {
    PageableObject<KhachHangResponse> getAll(KhachHangRequest request);

    KhachHang getOne(Integer id);

    KhachHang getOneKhachHang(Integer id);

    KhachHang create(KhachHangRequest request);

    KhachHang update(Integer id, KhachHangRequest request);

}
