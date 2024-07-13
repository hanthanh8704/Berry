package com.example.connectdb.service;

import com.example.connectdb.dto.request.color.MauSacRequest;
import com.example.connectdb.dto.request.label.ThuongHieuRequest;
import com.example.connectdb.dto.response.MauSacResponse;

import com.example.connectdb.dto.response.ThuongHieuResponse;
import com.example.connectdb.entity.MauSac;
import com.example.connectdb.entity.ThuongHieu;
import com.example.connectdb.util.common.PageableObject;

public interface ThuongHieuService {
    PageableObject<ThuongHieuResponse> getAll(ThuongHieuRequest request);

    ThuongHieu getOne(Integer id);

    ThuongHieu create(ThuongHieuRequest thuongHieuRequest);

    ThuongHieu update(Integer id, ThuongHieuRequest thuongHieuRequest);
}
