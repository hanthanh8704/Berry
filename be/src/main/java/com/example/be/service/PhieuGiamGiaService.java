package com.example.be.service;

import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.PhieuGiamGia;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PhieuGiamGiaService {
    List<PhieuGiamGiaResponse> getAccountVoucher(Integer id,PhieuGiamGiaRequest request);
    List<PhieuGiamGiaResponse> getPublicVoucher(PhieuGiamGiaRequest request);
    PageableObject<PhieuGiamGiaResponse> getAll(PhieuGiamGiaRequest request);
    PhieuGiamGiaResponse getOne(Integer id);

    PhieuGiamGia add(PhieuGiamGiaRequest voucher);

    PhieuGiamGia update(Integer id, PhieuGiamGiaRequest voucher);

    String delete(Integer id);

    boolean isVoucherCodeExists(String code);

    void updateStatusVoucher();

    PhieuGiamGia updateEndDate(Integer id);
}
