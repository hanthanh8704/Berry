package com.example.be.service;

import com.example.be.dto.request.nhanVien.NhanVienDto;
import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import com.example.be.util.common.PageableObject;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NhanVienService {
    PageableObject<NhanVienResponse> getAll(NhanVienRequest request);
    NhanVien createNhanVien(NhanVienRequest nhanVienRequest,String vaiTro);


    NhanVienResponse getNhanVienById(Integer idNV);

    NhanVienResponse update(Integer idNV, NhanVienRequest nhanVienRequest);


}
