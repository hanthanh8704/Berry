package com.example.connectdb.service;

import com.example.connectdb.dto.request.color.MauSacRequest;

import com.example.connectdb.dto.response.MauSacResponse;

import com.example.connectdb.entity.MauSac;

import com.example.connectdb.util.common.PageableObject;

import java.util.List;

public interface MauSacService {
    PageableObject<MauSacResponse> getAll(MauSacRequest request);
    MauSac findByMa(String ma);
    MauSac getOne(Integer id);

    MauSac create(MauSacRequest mauSacRequest);

    MauSac update(Integer id, MauSacRequest mauSacRequest);


}
