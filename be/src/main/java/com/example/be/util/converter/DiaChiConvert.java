package com.example.be.util.converter;


import com.example.be.dto.request.khachHang.DiaChiRequest;
import com.example.be.entity.DiaChi;
import com.example.be.repository.DiaChiRepository;
import com.example.be.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DiaChiConvert {
    @Autowired
    private DiaChiRepository addressRepository;
    @Autowired
    private KhachHangRepository accountRepository;

    public DiaChi convertRequestToEntity(DiaChiRequest request) {
        return DiaChi.builder()
                .idKhachHang(request.getIdKhachHang() != null ? accountRepository.findById(request.getIdKhachHang()).orElse(null) : null)
                .hoTen(request.getHoTen())
                .soDienThoai(request.getSoDienThoai())
                .thanhPho(request.getThanhPho())
                .huyen(request.getHuyen())
                .phuong(request.getPhuong())
                .diaChiMacDinh(request.getDiaChiMacDinh())
                .diaChiCuThe(request.getDiaChiCuThe())
                .trangThai(request.getTrangThai())
                .nguoiSua(request.getNguoiSua())
                .build();
    }
    public DiaChi convertRequestToEntity(Integer id, DiaChiRequest request) {
        DiaChi diaChi = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Địa chỉ với id: " + id));
        diaChi.setHoTen(request.getHoTen());
        diaChi.setSoDienThoai(request.getSoDienThoai());
        diaChi.setThanhPho(request.getThanhPho());
        diaChi.setHuyen(request.getHuyen());
        diaChi.setPhuong(request.getPhuong());
        diaChi.setDiaChiMacDinh(request.getDiaChiMacDinh());
        diaChi.setDiaChiCuThe(request.getDiaChiCuThe());
        diaChi.setTrangThai(request.getTrangThai());
        diaChi.setNguoiSua(request.getNguoiSua());
        return diaChi;
    }
}
