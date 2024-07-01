package com.example.TuHocFullStack.service;

import com.example.TuHocFullStack.dto.NhanVienDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NhanVienService {
    NhanVienDto createNhanVien(NhanVienDto nhanVienDto);

    List<NhanVienDto> getAllNhanVien();  // Sửa đổi tên phương thức thành số nhiều

    NhanVienDto getNhanVienById(Integer idNV);

    NhanVienDto update(Integer idNV, NhanVienDto UpdatenhanVienDto);

    void delete(Integer idNV);
}
