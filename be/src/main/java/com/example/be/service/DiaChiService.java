package com.example.be.service;


import com.example.be.dto.request.khachHang.DiaChiRequest;
import com.example.be.dto.response.DiaChiResponse;
import com.example.be.entity.DiaChi;
import org.springframework.data.domain.Page;

public interface DiaChiService {
    Page<DiaChiResponse> getByAccount(Integer id, DiaChiRequest request);

    DiaChi create(DiaChiRequest request);

    DiaChi update(Integer idAddress, DiaChiRequest request);

    DiaChi delete(Integer idAddress);
}
