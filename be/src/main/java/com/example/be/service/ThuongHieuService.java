package com.example.be.service;

import com.example.be.dto.request.color.MauSacRequest;
import com.example.be.dto.request.label.ThuongHieuRequest;
import com.example.be.dto.response.MauSacResponse;

import com.example.be.dto.response.ThuongHieuResponse;
import com.example.be.entity.MauSac;
import com.example.be.entity.ThuongHieu;
import com.example.be.util.common.PageableObject;

public interface ThuongHieuService {
    PageableObject<ThuongHieuResponse> getAll(ThuongHieuRequest request);

    ThuongHieu getOne(Integer id);

    ThuongHieu create(ThuongHieuRequest thuongHieuRequest);

    ThuongHieu update(Integer id, ThuongHieuRequest thuongHieuRequest);
}
