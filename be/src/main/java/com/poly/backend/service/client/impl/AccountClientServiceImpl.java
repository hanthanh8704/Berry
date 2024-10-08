package com.poly.backend.service.client.impl;

import com.poly.backend.dto.request.khachhang.KhachHangRequest;
import com.poly.backend.entity.English.Customer;

import com.poly.backend.repository.KhachHangRepository;
import com.poly.backend.service.client.AccountClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountClientServiceImpl implements AccountClientService {
    @Autowired
    KhachHangRepository khachHangRepository;

    @Override
    public KhachHangRequest updateKH(Integer idKH, KhachHangRequest request) {
        Optional<Customer> optionalKhachHang = khachHangRepository.findById(idKH);
        if (optionalKhachHang.isPresent()) {
            Customer khachHang = optionalKhachHang.get();

            // Cập nhật thông tin từ request vào đối tượng KhachHang
            khachHang.setImage(request.getImage());
            khachHang.setFullName(request.getFullName());
            khachHang.setEmail(request.getEmail());
            khachHang.setPhoneNumber(request.getPhoneNumber());
            khachHang.setDateOfBirth(request.getDateOfBirth());

            // Lưu thay đổi vào cơ sở dữ liệu
            khachHangRepository.save(khachHang);

            // Tạo đối tượng KhachHangRequest để trả về
            KhachHangRequest khachHangResponse = new KhachHangRequest();
            khachHangResponse.setImage(khachHang.getImage());
            khachHangResponse.setFullName(khachHang.getFullName());
            khachHangResponse.setEmail(khachHang.getEmail());
            khachHangResponse.setPhoneNumber(khachHang.getPhoneNumber());
            khachHangResponse.setDateOfBirth(khachHang.getDateOfBirth());

            return khachHangResponse;
        } else {
            throw new RuntimeException("Không tìm thấy khách hàng với ID: " + idKH);
        }
    }

}
