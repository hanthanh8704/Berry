package com.example.be.service.impl;

import com.example.be.dto.response.LichSuHoaDonResponse;
import com.example.be.repository.LichSuHoaDonRepository;
import com.example.be.service.LichSuHoaDonService;
import com.example.be.util.common.LichSuHoaDonConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LichSuHoaDonImpl implements LichSuHoaDonService {
    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    private LichSuHoaDonConvert lichSuHoaDonConvert;

    @Override
    public List<LichSuHoaDonResponse> getByBill(Integer idHoaDon) {
        return lichSuHoaDonRepository.getByBill(idHoaDon);
    }
}
