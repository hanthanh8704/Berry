package com.example.be.service.impl;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.dto.request.bill.HoaDonSearchRequest;
import com.example.be.dto.response.HoaDonResponse;
import com.example.be.dto.response.TKHoaDonTrangThai;
import com.example.be.entity.HoaDon;
import com.example.be.repository.HoaDonRepository;
import com.example.be.service.HoaDonService;
import com.example.be.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class HoaDonImpl implements HoaDonService {
    private final HoaDonRepository hoaDonRepository;

    @Autowired
    public HoaDonImpl(HoaDonRepository hoaDonRepository) {
        this.hoaDonRepository = hoaDonRepository;
    }

    @Override
    public PageableObject<HoaDonResponse> getAll(HoaDonSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonRepository.getAllHoaDon(request, pageable));
    }

    @Override
    public List<TKHoaDonTrangThai> getHoaDonByTrangThai() {
        return hoaDonRepository.getHoaDonByTrangThai();
    }

//    @Override
//    public List<HoaDon> getNewHoaDon(HoaDonSearchRequest request) {
//        return hoaDonRepository.getNewHoaDon(request);
//    }

    @Override
    public HoaDon findByMa(String ma) {
        return hoaDonRepository.findByMa(ma);
    }

    @Override
    public HoaDon getOne(Integer id) {
        return hoaDonRepository.findById(id).orElse(null);
    }
}
