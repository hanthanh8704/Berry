package com.example.be.service;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import com.example.be.util.common.PageableObject;
import org.springframework.stereotype.Service;

@Service
public interface NhanVienService {
    PageableObject<NhanVienResponse> getAll(NhanVienRequest request);
    NhanVien createNhanVien(NhanVienRequest nhanVienRequest, String vaiTro);

    NhanVienResponse getOne(Integer id);

    NhanVien getNhanVienById(Integer idNV);

    NhanVien update(Integer idNV, NhanVienRequest nhanVienRequest);

}
