package com.example.be.service;

import com.example.be.dto.request.color.MauSacRequest;

import com.example.be.dto.response.MauSacResponse;

import com.example.be.entity.MauSac;

import com.example.be.util.common.PageableObject;

import java.util.List;

public interface MauSacService {
    PageableObject<MauSacResponse> getAll(MauSacRequest request);

    MauSac getOne(Integer id);

    MauSac create(MauSacRequest mauSacRequest);

    MauSac update(Integer id, MauSacRequest mauSacRequest);


}
