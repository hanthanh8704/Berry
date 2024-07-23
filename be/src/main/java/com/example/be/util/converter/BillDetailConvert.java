package com.example.be.util.converter;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.DotGiamGiaDetail;
import com.example.be.entity.HoaDon;
import com.example.be.entity.HoaDonChiTiet;
import com.example.be.repository.ChiTietSanPhamRepository;
import com.example.be.repository.DotGiamGiaDetailRepository;
import com.example.be.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillDetailConvert {
    private final DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    private final ChiTietSanPhamRepository chiTietSanPhamRepository;
    private final HoaDonRepository hoaDonRepository;
    @Autowired
    public BillDetailConvert(DotGiamGiaDetailRepository dotGiamGiaDetailRepository, ChiTietSanPhamRepository chiTietSanPhamRepository, HoaDonRepository hoaDonRepository) {
        this.dotGiamGiaDetailRepository = dotGiamGiaDetailRepository;
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.hoaDonRepository = hoaDonRepository;
    }

    public HoaDonChiTiet convertRequestToEntity(BillDetailRequest request) {
        ChiTietSanPham ctsp = chiTietSanPhamRepository.findByMaSPCT(request.getChiTietSanPham());
        HoaDon hd = hoaDonRepository.findById(request.getHoaDon()).get();
        DotGiamGiaDetail dotGiamGiaDetail = dotGiamGiaDetailRepository.findByIdSPCT_Ma(request.getChiTietSanPham());
        return HoaDonChiTiet.builder()
                .hoaDon(hd)
                .chiTietSanPham(ctsp)
                .donGia(dotGiamGiaDetail != null? dotGiamGiaDetail.getGiaMoi() : ctsp.getGiaBan())
                .soLuong(request.getSoLuong())
                .trangThai(request.getTrangThai())
                .build();
    }

    public HoaDonChiTiet convertRequestToEntity(HoaDonChiTiet entity, BillDetailRequest request) {
        ChiTietSanPham ctsp = chiTietSanPhamRepository.findByMa(request.getMaSPCT());
        HoaDon hd = hoaDonRepository.findById(request.getIdHoaDon()).get();
        DotGiamGiaDetail dotGiamGiaDetail = dotGiamGiaDetailRepository.findByIdSPCT_Ma(request.getChiTietSanPham());
        entity.setChiTietSanPham(ctsp);
        entity.setHoaDon(hd);
        entity.setDonGia(dotGiamGiaDetail != null ? dotGiamGiaDetail.getGiaMoi() : ctsp.getGiaBan());
        entity.setSoLuong(request.getSoLuong());
        return entity;
    }
}
