package com.example.be.service.impl;

import com.example.be.dto.request.nhanVien.NhanVienDto;
import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import com.example.be.repository.ChucVuRepository;
import com.example.be.repository.NhanVienRepository;
import com.example.be.service.NhanVienService;
import com.example.be.util.CloudinaryUtils;
import com.example.be.util.common.GenCode;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.NhanVienConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NhanVienImpl implements NhanVienService {

    @Autowired
    private NhanVienConvert nhanVienConvert;
    @Autowired
    private ChucVuRepository chucVuRepository;
    @Autowired
    private CloudinaryUtils cloudinaryUtils;
    private final NhanVienRepository nhanVienRepository;

    @Autowired
    public NhanVienImpl(NhanVienRepository nhanVienRepository) {
        this.nhanVienRepository = nhanVienRepository;
    }

    @Override
    public PageableObject<NhanVienResponse> getAll(NhanVienRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(nhanVienRepository.getAll(request, pageable));
    }


    @Override
    public NhanVien createNhanVien(NhanVienRequest nhanVienRequest, String vaiTro) {
        String randomPassword = GenCode.randomPassword();
        NhanVien account = nhanVienConvert.convertRequestToEntity(nhanVienRequest);
        account.setChucVu(chucVuRepository.findByVaiTro(vaiTro));
        account.setMatKhau(randomPassword);
//        account.setAnh("defaultAvatar.jpg");
        NhanVien accountSave = nhanVienRepository.save(account);
        if (accountSave != null) {

//            if (nhanVienRequest.getAnh() != null)
//                accountSave.setAnh(String.valueOf(cloudinaryUtils.uploadSingleImage(nhanVienRequest.getAnh(), "nhanvien")));
        }
        return account;
    }

    @Override
    public NhanVienResponse getNhanVienById(Integer idNV) {
        return null;
    }

    @Override
    public NhanVienResponse update(Integer idNV, NhanVienRequest nhanVienRequest) {
        return null;
    }


}
