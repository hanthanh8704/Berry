//package com.poly.backend.service.impl;
//
//import com.poly.backend.dto.request.trahang.TraHangRequest;
//import com.poly.backend.entity.*;
//import com.poly.backend.infrastructure.common.ResponseObject;
//import com.poly.backend.infrastructure.constant.BillStatusConstant;
//import com.poly.backend.infrastructure.converter.DotGiamGiaConvert;
//import com.poly.backend.infrastructure.converter.TraHangConvert;
//import com.poly.backend.repository.*;
//import com.poly.backend.service.DotGiamGiaService;
//import com.poly.backend.service.TraHangService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class TraHangImpl implements TraHangService {
//    @Autowired
//    TraHangRepository traHangRepository;
//    @Autowired
//    SPCT_Repository spct_repository;
//    @Autowired
//    HoaDonRepository hoaDonRepository;
//    @Autowired
//    HoaDonChiTietRepository hoaDonChiTietRepository;
//    @Autowired
//    NhanVienRepository nhanVienRepository;
//    @Autowired
//    LichSuHoaDonRepository lichSuHoaDonRepository;
//    @Autowired
//    private TraHangConvert traHangConvert;
//
//    @Override
//    public List<HoaDonChiTiet> findAllByIDHoaDon(Integer idHD) {
//        return traHangRepository.findAllSPCTByIdHoaDon(idHD);
//    }
//
//    @Override
//    public List<HoaDon> findAllHDByMaHoaDon(String maHD) {
//        return traHangRepository.findAllHDByMaHoaDon(maHD);
//    }
//
//
//    //Ham chuan khi không lấy được  số lượng  khi mình giảm cả 2 TH
////    @Override
////    public ResponseObject create(TraHangRequest request) {
////        // Tìm hóa đơn từ idHoaDon
////        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
////                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));
////
////        // Tìm nhân viên từ idNhanVien
////        NhanVien nhanVien = nhanVienRepository.findById(request.getIdNhanVien())
////                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));
////
////        // Duyệt qua danh sách idSpct
////        for (Integer spctId : request.getIdSpct()) {
////
////            // Tìm chi tiết sản phẩm từ idSpct
////            SPCT spct = spct_repository.findById(spctId)
////                    .orElseThrow(() -> new RuntimeException("Chi tiết sản phẩm không tồn tại"));
////
////            // Tìm chi tiết hóa đơn tương ứng
////            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonIdAndChiTietSanPhamId(request.getIdHoaDon(), spctId)
////                    .orElseThrow(() -> new RuntimeException("Chi tiết hóa đơn không tồn tại"));
////
////            // Tạo đối tượng TraHang từ request cho từng spctId
////
////            request.setSoLuong(hoaDonChiTiet.getSoLuong());
////            request.setGiaBan(hoaDonChiTiet.getDonGia());
////            request.setTongTien(hoaDonChiTiet.getDonGia().multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())));
////
////            TraHang traHang = traHangConvert.convertRequestToEntity(request);
////            traHang.setHoaDon(hoaDon);
////            traHang.setNhanVien(nhanVien);
////            traHang.setSpct(spct);
////            traHang.setSoLuong(hoaDonChiTiet.getSoLuong());
////            traHang.setGiaBan(hoaDonChiTiet.getDonGia());
////            traHang.setTongTien(hoaDonChiTiet.getDonGia().multiply(BigDecimal.valueOf(hoaDonChiTiet.getSoLuong())));
////
////            // Lưu đối tượng TraHang
////            traHangRepository.save(traHang);
////
////            // Ghi lịch sử hóa đơn
////            LichSuHoaDon history = new LichSuHoaDon();
////            history.setHoaDon(hoaDon);
////            history.setTrangThai("Trả hàng");
////            history.setNhanVien(nhanVien);
////            history.setGhiChu("Trả sản phẩm \"" + spct.getIdSanPham().getTen() + " [" + spct.getIdMauSac().getTen() +
////                    "-" + spct.getIdKichCo().getTen() + "]\" - Số lượng: \"" + request.getSoLuong() + "\". Lý do: " + request.getLyDo());
////            lichSuHoaDonRepository.save(history);
////
////
////            // Cập nhật lại chi tiết hóa đơn
////            hoaDonChiTiet.setSoLuong(hoaDonChiTiet.getSoLuong() - request.getSoLuong());
////            if (hoaDonChiTiet.getSoLuong() == 0) {
////                hoaDonChiTiet.setTrangThai("Ngừng hoạt động");
////            }
////            hoaDonChiTietRepository.save(hoaDonChiTiet);
////
////            // Cập nhật tổng tiền hóa đơn
////            hoaDon.setTongTien(hoaDon.getTongTien().subtract(request.getTongTien()));
////            hoaDonRepository.save(hoaDon);
////
////            // Cập nhật số lượng sản phẩm chi tiết
////            spct.setSoLuong(spct.getSoLuong() + request.getSoLuong());
////            spct.setTrangThai("Còn hàng");
////            spct_repository.save(spct);
////        }
////
////        // Kiểm tra trạng thái chi tiết hóa đơn và cập nhật trạng thái hóa đơn nếu cần
////        if (hoaDonChiTietRepository.findByHoaDonAndTrangThai(hoaDon, "Ngừng hoạt động").isEmpty()) {
////            hoaDon.setTrangThaiHoaDon("Đã hủy");
////            hoaDonRepository.save(hoaDon);
////            LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
////            lichSuHoaDon.setHoaDon(hoaDon);
////            lichSuHoaDon.setGhiChu("Đơn hàng đã bị hủy");
////            lichSuHoaDon.setTrangThai("Đã hủy");
////            lichSuHoaDonRepository.save(lichSuHoaDon);
////        }
////
////        return new ResponseObject("Thêm trả hàng thành công");
////    }
//
//    //Ham test sửa không lấy được  số lượng  khi mình giảm cả 2 TH
//
//    @Override
//    public ResponseObject create(TraHangRequest request) {
//        // Tìm hóa đơn từ idHoaDon
//        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
//                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));
//
//        // Tìm nhân viên từ idNhanVien
//        NhanVien nhanVien = nhanVienRepository.findById(request.getIdNhanVien())
//                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));
//
//        // Duyệt qua danh sách idSpct
//        for (int i = 0; i < request.getIdSpct().size(); i++) {
//            Integer spctId = request.getIdSpct().get(i);
//            Integer soLuong = request.getSoLuong().get(i);
//            BigDecimal giaBan = request.getGiaBan().get(i);
//            BigDecimal tongTien = request.getTongTien().get(i);
//
//            // Tìm chi tiết sản phẩm từ idSpct
//            SPCT spct = spct_repository.findById(spctId)
//                    .orElseThrow(() -> new RuntimeException("Chi tiết sản phẩm không tồn tại"));
//
//            // Tìm chi tiết hóa đơn tương ứng
//            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonIdAndChiTietSanPhamId(request.getIdHoaDon(), spctId)
//                    .orElseThrow(() -> new RuntimeException("Chi tiết hóa đơn không tồn tại"));
//            TraHang traHang = traHangConvert.convertRequestToEntity(request);
//            traHang.setHoaDon(hoaDon);
//            traHang.setNhanVien(nhanVien);
//            traHang.setSpct(spct);
//            traHang.setSoLuong(soLuong);
//            traHang.setGiaBan(giaBan);
//            traHang.setTongTien(tongTien);
//
//            // Lưu đối tượng TraHang
//            traHangRepository.save(traHang);
//
//            // Ghi lịch sử hóa đơn
//            LichSuHoaDon history = new LichSuHoaDon();
//            history.setHoaDon(hoaDon);
//            history.setTrangThai("Trả hàng");
//            history.setNhanVien(nhanVien);
//            history.setGhiChu("Trả sản phẩm \"" + spct.getIdSanPham().getTen() + " [" + spct.getIdMauSac().getTen() +
//                    "-" + spct.getIdKichCo().getTen() + "]\" - Số lượng: \"" + soLuong + "\". Lý do: " + request.getLyDo());
//            lichSuHoaDonRepository.save(history);
//
//            // Cập nhật lại chi tiết hóa đơn
//            hoaDonChiTiet.setSoLuong(hoaDonChiTiet.getSoLuong() - soLuong);
//            if (hoaDonChiTiet.getSoLuong() == 0) {
//                hoaDonChiTiet.setTrangThai("Ngừng hoạt động");
//            }
//            hoaDonChiTietRepository.save(hoaDonChiTiet);
//
//            // Cập nhật tổng tiền hóa đơn
//            hoaDon.setTongTien(hoaDon.getTongTien().subtract(tongTien));
//            hoaDonRepository.save(hoaDon);
//
//            // Cập nhật số lượng sản phẩm chi tiết
//            spct.setSoLuong(spct.getSoLuong() + soLuong);
//            spct.setTrangThai("Còn hàng");
//            spct_repository.save(spct);
//        }
//
//        // Kiểm tra trạng thái chi tiết hóa đơn và cập nhật trạng thái hóa đơn nếu cần
//        if (hoaDonChiTietRepository.findByHoaDonAndTrangThai(hoaDon, "Ngừng hoạt động").isEmpty()) {
//            hoaDon.setTrangThaiHoaDon("Đã hủy");
//            hoaDonRepository.save(hoaDon);
//            LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
//            lichSuHoaDon.setHoaDon(hoaDon);
//            lichSuHoaDon.setGhiChu("Đơn hàng đã bị hủy");
//            lichSuHoaDon.setTrangThai("Đã hủy");
//            lichSuHoaDonRepository.save(lichSuHoaDon);
//        }
//
//        return new ResponseObject("Thêm trả hàng thành công");
//    }
//
//
//}
