package com.example.TuHocFullStack.service;

import com.example.TuHocFullStack.dto.NhanVienDto;
import com.example.TuHocFullStack.entity.DotGiamGia;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface DotGiamGiaService {
    DotGiamGia createDotGiamGia(DotGiamGia dotGiamGia);

    List<DotGiamGia> getAllDotGiamGia();  // Sửa đổi tên phương thức thành số nhiều

    DotGiamGia getDotGiamGiaById(Integer idDGG);

    DotGiamGia update(Integer idDGG, DotGiamGia updateDotGiamGia);

    void delete(Integer idDGG);
    void updateTrangThai();
}
