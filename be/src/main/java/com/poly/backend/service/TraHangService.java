//package com.poly.backend.service;
//
//import com.poly.backend.dto.request.DotGiamGiaRequest;
//import com.poly.backend.dto.request.trahang.TraHangRequest;
//import com.poly.backend.entity.HoaDon;
//import com.poly.backend.entity.HoaDonChiTiet;
//import com.poly.backend.entity.SPCT;
//import com.poly.backend.infrastructure.common.ResponseObject;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//
//public interface TraHangService {
//    List<HoaDonChiTiet> findAllByIDHoaDon(Integer idHD);
//    List<HoaDon> findAllHDByMaHoaDon(String maHD);
//    ResponseObject create(TraHangRequest request);
//}
