//package com.example.be.util.converter;
//
//import com.example.be.dto.request.khachhang.KhachhangRequest;
//import com.example.be.entity.KhachHang;
//import com.example.be.repository.KhachHangRepository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//@Component
//public class KhachHangConvert {
//    @Autowired
//    private KhachHangRepository accountRepository;
////    @Autowired
////    private IRoleRepository roleRepository;
//    public KhachHang convertRequestToEntity(KhachhangRequest request){
//        return KhachHang.builder()
//                .taiKhoan(request.getTaiKhoan())
//                .ten(request.getTen())
//                .gioiTinh(request.getGioiTinh())
//                .email(request.getEmail())
////                .cccd(request.getCccd())
//                .soDienThoai(request.getSoDienThoai())
////                .birthday(request.getBirthday())
//                .build();
//    }
//    public KhachHang convertRequestToEntity(Integer id,KhachhangRequest request){
//        KhachHang account = accountRepository.findById(id).get();
//        account.setMatKhau(request.getMatKhau() == null ? account.getMatKhau() : request.getMatKhau());
////        account.setBirthday(request.getBirthday());
//        account.setEmail(request.getEmail());
//        account.setTen(request.getTen());
////        account.setCccd(request.getCccd());
//        account.setTaiKhoan(request.getTaiKhoan());
//        account.setSoDienThoai(request.getSoDienThoai());
//        account.setGioiTinh(request.getGioiTinh());
//        return account;
//    }
//}
