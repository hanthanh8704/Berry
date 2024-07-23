package com.example.be.util.converter;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.entity.HoaDon;
import com.example.be.repository.HoaDonRepository;
import com.example.be.repository.KhachHangRepository;
import com.example.be.repository.PhieuGiamGiaRepository;
import org.springframework.stereotype.Component;

@Component
public class BillConvert {
    private final HoaDonRepository hoaDonRepository;
    private final PhieuGiamGiaRepository phieuGiamGiaRepository;
    private final KhachHangRepository khachHangRepository;

    public BillConvert(HoaDonRepository hoaDonRepository, PhieuGiamGiaRepository phieuGiamGiaRepository, KhachHangRepository khachHangRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.phieuGiamGiaRepository = phieuGiamGiaRepository;
        this.khachHangRepository = khachHangRepository;
    }

    public String genBillCode() {
        String prefix = "HD100";
        int x = 1;
        String code = prefix + x;
        while (hoaDonRepository.existsByMa(code)) {
            x++;
            code = prefix + x;
        }
        System.out.println(code);
        return code;
    }

    public HoaDon convertRequestToEntity(HoaDon entity, HoaDonRequest request) {
        if(request.getPhieuGiamGia() != null){
            entity.setPhieuGiamGia(phieuGiamGiaRepository.findById(request.getPhieuGiamGia()).get());
            System.out.println(request.getPhieuGiamGia());
        }
        if(request.getKhachHang() != null){
            entity.setKhachHang(khachHangRepository.findById(request.getKhachHang()).get());
        }
        entity.setTenNguoiNhan(request.getTenNguoiNhan());
        entity.setSoDienThoaiNguoiNhan(request.getSoDienThoaiNguoiNhan());
        entity.setDiaChi(request.getDiaChi());
        entity.setPhiShip(request.getPhiShip());
        entity.setSoTienDuocGiam(request.getSoTienDuocGiam());
        entity.setTongTien(request.getTongTien().subtract(request.getSoTienDuocGiam()));
        entity.setGhiChu(request.getGhiChu());
        entity.setTrangThaiHoaDon(request.getTrangThaiHoaDon());
        entity.setLoaiHoaDon(request.getLoaiHoaDon());
        return entity;
    }
}
