package com.example.be.util.converter;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.entity.KhachHang;
import com.example.be.entity.NhanVien;
import com.example.be.repository.ChucVuRepository;
import com.example.be.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NhanVienConvert {
    @Autowired
    private NhanVienRepository accountRepository;
        @Autowired
    private ChucVuRepository roleRepository;
    public NhanVien convertRequestToEntity(NhanVienRequest request){
        return NhanVien.builder()
                .ma(request.getMa())
                .ten(request.getTen())
                .diaChi(request.getDiaChi())
                .ngaySinh(request.getNgaySinh())
                .soDienThoai(request.getSoDienThoai())
                .gioiTinh(request.getGioiTinh())
                .cccd(request.getCccd())
                .taiKhoan(request.getTaiKhoan())
                .matKhau(request.getMatKhau())
                .email(request.getEmail())
//                .anh(request.getAnh().toString())
                .trangThai(request.getTrangThai())
                .chucVu(request.getIdChucVu() != null ? roleRepository.findById(request.getIdChucVu()).orElse(null) : null)
                .build();
    }
    public NhanVien convertRequestToEntity(Integer id,NhanVienRequest request){
        NhanVien account = accountRepository.findById(id).get();
        account.setMatKhau(request.getMatKhau() == null ? account.getMatKhau() : request.getMatKhau());
        account.setNgaySinh(request.getNgaySinh());
        account.setEmail(request.getEmail());
        account.setTen(request.getTen());
        account.setCccd(request.getCccd());
        account.setTaiKhoan(request.getTaiKhoan());
        account.setSoDienThoai(request.getSoDienThoai());
        account.setGioiTinh(request.getGioiTinh());
//        account.setAnh(request.getAnh().toString());
        account.setTrangThai(request.getTrangThai());
        return account;
    }
}
