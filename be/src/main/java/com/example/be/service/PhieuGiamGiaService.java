package com.example.be.service;

import com.example.be.dto.request.KhachHang.KhachHangRequest;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.KhachHang;
import com.example.be.entity.PhieuGiamGia;
import com.example.be.utils.common.PageableObject;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;


public interface PhieuGiamGiaService {
    List<PhieuGiamGiaResponse> getAccountVoucher(Integer id,PhieuGiamGiaRequest request);
    List<PhieuGiamGiaResponse> getPublicVoucher(PhieuGiamGiaRequest request);
    PageableObject<PhieuGiamGiaResponse> getAll(PhieuGiamGiaRequest request);
    PhieuGiamGiaResponse getOne(Integer id);

    PhieuGiamGiaResponse edit(Integer id);

    PhieuGiamGia add(PhieuGiamGiaRequest voucher);

    PhieuGiamGia update(Integer id, PhieuGiamGiaRequest voucher);

    String delete(Integer id);

    boolean isVoucherCodeExists(String code);

    void updateStatusVoucher();

    PhieuGiamGia updateEndDate(Integer id);
    PageableObject<KhachHangResponse> findKhachHang(KhachHangRequest request);
}