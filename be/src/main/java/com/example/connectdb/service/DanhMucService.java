package com.example.connectdb.service;

import com.example.connectdb.dto.request.category.DanhMucRequest;
import com.example.connectdb.dto.response.DanhMucResponse;
import com.example.connectdb.entity.DanhMuc;
import com.example.connectdb.util.common.PageableObject;

import java.util.List;

public interface DanhMucService {
    PageableObject<DanhMucResponse> getAll(DanhMucRequest request);
    DanhMuc findByMa(String ma);
    DanhMuc getOne(Integer id);
    DanhMuc create(DanhMucRequest danhMucRequest);
    DanhMuc update(Integer id, DanhMucRequest danhMucRequest);
}
