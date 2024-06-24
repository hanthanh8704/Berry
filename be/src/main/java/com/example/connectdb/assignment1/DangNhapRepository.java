package com.example.connectdb.assignment1;

import com.example.demo.entity.NhanVien;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class DangNhapRepository {
    NhanVienRepository nhanVienRepository = new NhanVienRepository();
    List<NhanVien> listNV = new ArrayList<>();

    public boolean validateLogin(NhanVien nv) {
        for (NhanVien s : nhanVienRepository.findAll()) {
            if (s.getTenDN().equalsIgnoreCase(nv.getTenDN()) && s.getMatKhau().equalsIgnoreCase(nv.getMatKhau())) {
                return true;
            }
        }
        return false;
    }



}
