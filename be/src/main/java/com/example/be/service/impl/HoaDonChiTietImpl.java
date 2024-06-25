package com.example.be.service.impl;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.HoaDonChiTiet;
import com.example.be.repository.HoaDonChiTietRepository;
import com.example.be.service.HoaDonChiTietService;
import com.example.be.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class HoaDonChiTietImpl implements HoaDonChiTietService {
    private final HoaDonChiTietRepository hoaDonDonChiTietRepository;

    @Autowired
    public HoaDonChiTietImpl(HoaDonChiTietRepository hoaDonDonChiTietRepository) {
        this.hoaDonDonChiTietRepository = hoaDonDonChiTietRepository;
    }

    @Override
    public PageableObject<HoaDonChiTietResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonDonChiTietRepository.getAllHoaDonChiTiet(request, pageable));
    }

    @Override
    public HoaDonChiTiet getOne(Integer id) {
        return hoaDonDonChiTietRepository.findById(id).orElse(null);
    }
}
