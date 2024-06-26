package com.example.be.utils.converter;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.entity.PhieuGiamGia;
import com.example.be.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PhieuGiamGiaConvert {
    @Autowired
    private PhieuGiamGiaRepository voucherRepository;

    public PhieuGiamGia converRequestToEntity(PhieuGiamGiaRequest request){
        return PhieuGiamGia.builder()
                .ma(request.getMa())
                .ten(request.getTen())
                .soLuong(request.getSoLuong())
                .kieuGiam(request.getKieuGiam())
                .giaTriGiam((request.getGiaTriGiam()))
                .giaTriToiDa((request.getGiaTriToiDa()))
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .trangThai(request.getTrangThai())
                .ngayTao(request.getNgayTao())
                .ngaySua(request.getNgaySua())
                .nguoiTao(request.getNguoiTao())
                .nguoiSua(request.getNguoiSua())
                .build();
    }
    public PhieuGiamGia convertRequestToEntity(Integer id, PhieuGiamGiaRequest request){
        PhieuGiamGia voucher = voucherRepository.findById(id).get();
        voucher.setMa(request.getMa());
        voucher.setTen(request.getTen());
        voucher.setSoLuong(request.getSoLuong());
        voucher.setGiaTriGiam((request.getGiaTriGiam()));
        voucher.setGiaTriToiDa((request.getGiaTriToiDa()));
        voucher.setNgayBatDau(request.getNgayBatDau());
        voucher.setNgayKetThuc(request.getNgayKetThuc());
        voucher.setTrangThai(request.getTrangThai());
        voucher.setNgayTao(request.getNgayTao());
        voucher.setNgaySua(request.getNgaySua());
        voucher.setNguoiTao(request.getNguoiTao());
        voucher.setNguoiSua(request.getNguoiSua());
        return voucher;
    }
}
