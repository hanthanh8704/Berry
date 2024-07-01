//package com.example.be.util.converter;
//
//
//import com.example.be.dto.request.khachhang.DiaChiRequest;
//import com.example.be.entity.DiaChi;
//import com.example.be.repository.KhachHangRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DiaChiConvert {
//    @Autowired
//    private DiaChiRepository addressRepository;
//    @Autowired
//    private KhachHangRepository accountRepository;
//    public DiaChi convertRequestToEntity(DiaChiRequest request) {
//        return DiaChi.builder()
//                .khachHang(request.getKhachHang() != null ? accountRepository.findById(request.getKhachHang()).orElse(null) : null)
////                .(request.getName())
//                .diaChiMacDinh(false)
//                .tinh(request.getTinh())
//                .thanhPho(request.getThanhPho())
//                .phuong(request.getPhuong())
////                .(request.getPhoneNumber())
//                .ghichu(request.getGhichu())
//                .build();
//    }
//    public DiaChi convertRequestToEntity(Integer id, DiaChiRequest request){
//        DiaChi address = addressRepository.findById(id).get();
//        address.setGhichu(request.getGhichu());
//        address.setDiaChiMacDinh(request.getDiaChiMacDinh());
////        address.setName(request.getName());
//        address.setTinh(request.getTinh());
//        address.setThanhPho(request.getThanhPho());
//        address.setPhuong(request.getPhuong());
////        address.setPhoneNumber(request.getPhoneNumber());
//        return address;
//    }
//}
