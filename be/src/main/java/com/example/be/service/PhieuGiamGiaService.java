package com.example.be.service;


import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.PhieuGiamGia;
import com.example.be.entity.PhieuGiamGiaKhachHang;
import com.example.be.util.common.PageableObject;

import java.util.List;


public interface PhieuGiamGiaService {
    List<PhieuGiamGiaResponse> getAccountVoucher(Integer id,PhieuGiamGiaRequest request);
    List<PhieuGiamGiaResponse> getPublicVoucher(PhieuGiamGiaRequest request);

    List<PhieuGiamGiaKhachHang> getFind(Integer id);
    PageableObject<PhieuGiamGiaResponse> getAll(PhieuGiamGiaRequest request);
    PhieuGiamGiaResponse getOne(Integer id);


    PhieuGiamGia add(PhieuGiamGiaRequest voucher);

    PhieuGiamGia update(Integer id, PhieuGiamGiaRequest voucher);



    String delete(Integer id);

    boolean isVoucherCodeExists(String code);

    void updateStatusVoucher();

    PhieuGiamGia updateEndDate(Integer id);
    PageableObject<KhachHangResponse> findKhachHang(KhachHangRequest request);
    PageableObject<KhachHangResponse> findKhachHangIdPGG(Integer id,KhachHangRequest request);
}
