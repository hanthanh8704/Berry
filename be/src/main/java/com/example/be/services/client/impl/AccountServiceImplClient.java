package com.example.be.services.client.impl;

import com.example.be.dto.client.request.CustomerRequestClient;
import com.example.be.entities.Customer;
import com.example.be.repositories.client.CustomerRepositoryClient;
import com.example.be.services.client.AccountServiceClient;
import com.example.be.utils.cloudinary.CloudinaryUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountServiceImplClient implements AccountServiceClient {
    @Autowired
    CustomerRepositoryClient khachHangRepository;
    @Autowired
    CloudinaryUtil cloudinaryUtils;
    @Override
    public CustomerRequestClient updateKH(Integer idKH, CustomerRequestClient request) {
        Optional<Customer> optionalKhachHang = khachHangRepository.findById(idKH);
        if (optionalKhachHang.isPresent()) {
            Customer khachHang = optionalKhachHang.get();

            if (request.getImage() != null) {
                String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getImage(), "khachhang");
                khachHang.setImage(uploadedImageUrl);
            }

            // Cập nhật thông tin từ request vào đối tượng Khach
            khachHang.setFullName(request.getFullName());
            khachHang.setEmail(request.getEmail());
            khachHang.setPhoneNumber(request.getPhoneNumber());
            khachHang.setDateOfBirth(request.getDateOfBirth());

            // Lưu thay đổi vào cơ sở dữ liệu
            khachHangRepository.save(khachHang);

            // Tạo đối tượng KhachHangRequest để trả về
            CustomerRequestClient khachHangResponse = new CustomerRequestClient();

            khachHangResponse.setImageStr(khachHang.getImage());
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
