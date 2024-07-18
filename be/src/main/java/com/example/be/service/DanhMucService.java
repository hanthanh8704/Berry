package com.example.be.service;

import com.example.be.dto.request.category.DanhMucRequest;
import com.example.be.dto.response.DanhMucResponse;
import com.example.be.entity.DanhMuc;
import com.example.be.util.common.PageableObject;

import java.util.List;

public interface DanhMucService {
    PageableObject<DanhMucResponse> getAll(DanhMucRequest request);

    DanhMuc getOne(Integer id);

    DanhMuc create(DanhMucRequest danhMucRequest);

    DanhMuc update(Integer id, DanhMucRequest danhMucRequest);
}
