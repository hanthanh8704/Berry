package com.example.be.service;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.HoaDonChiTiet;
import com.example.be.util.common.PageableObject;

public interface HoaDonChiTietService {
    PageableObject<HoaDonChiTietResponse> getAll(BillDetailRequest request);

    HoaDonChiTiet getOne(Integer id);
}
