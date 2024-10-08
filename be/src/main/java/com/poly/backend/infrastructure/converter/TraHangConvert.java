//package com.poly.backend.infrastructure.converter;
//
//import com.poly.backend.dto.request.DotGiamGiaRequest;
//import com.poly.backend.dto.request.trahang.TraHangRequest;
//
//import com.poly.backend.repository.DotGiamGiaRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.Date;
//
//@Component
//public class TraHangConvert {
//
//    public TraHang convertRequestToEntity(TraHangRequest request) {
//        return TraHang.builder()
//                .lyDo(request.getLyDo()) // Lấy giá trị từ request
//                .ngayTra(LocalDateTime.now()) // Lấy ngày hiện tại
//                .trangThai("Đã xử lý") // Giá trị cố định
//                .build();
//    }
//
////    public TraHang convertRequestToEntity(TraHangRequest request) {
////        return TraHang.builder()
////                .lyDo(request.getLyDo()) // Lấy giá trị từ request
////                .ngayTra(LocalDateTime.now()) // Lấy ngày hiện tại
////                .trangThai("Đã xử lý") // Giá trị cố định
////                .build();
////    }
//
//
////    public TraHang convertRequestToEntity(TraHang traHang, TraHangRequest request) {
////        traHang.setSoLuong(request.getSoLuong());
////        traHang.setGiaBan(request.getGiaBan());
////        traHang.setTongTien(request.getTongTien());
////        traHang.setLyDo(request.getLyDo());
////        traHang.setNgayTra(request.getNgayTra());
////        traHang.setTrangThai("Đã xử lý");
////        return traHang;
////    }
//}
