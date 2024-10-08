//package com.poly.backend.controller.admin;
//
//
//import com.poly.backend.dto.request.trahang.TraHangRequest;
//import com.poly.backend.entity.HoaDon;
//import com.poly.backend.entity.HoaDonChiTiet;
//import com.poly.backend.entity.SPCT;
//import com.poly.backend.infrastructure.common.ResponseObject;
//import com.poly.backend.repository.HoaDonChiTietRepository;
//import com.poly.backend.repository.HoaDonRepository;
//import com.poly.backend.repository.SPCT_Repository;
//import com.poly.backend.repository.TraHangRepository;
//import com.poly.backend.service.TraHangService;
//import lombok.AllArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@AllArgsConstructor
//@CrossOrigin("*")
//@RestController
//@RequestMapping("/api/tra-hang")
//public class TraHangController {
//    @Autowired
//    private TraHangService traHangService;
//    @Autowired
//    private HoaDonRepository hoaDonRepository;
//    @Autowired
//    private TraHangRepository traHangRepository;
//    @Autowired
//    private SPCT_Repository spct_repository;
//    @Autowired
//    private HoaDonChiTietRepository hoaDonChiTietRepository;
//
//
//    // Tạo một yêu cầu trả hàng mới
//    @PostMapping("/create")
//    public ResponseObject create(@RequestBody TraHangRequest request) {
//        try {
//            return traHangService.create(request);
//        } catch (Exception e) {
//            return new ResponseObject(e.getMessage());
//        }
//    }
//
//    //Tìm kiém SPCT theo ma HD
//    @GetMapping("/hoa-don/search")
//    public ResponseEntity<HoaDon> search(@RequestParam("maHD") String maHD) {
//        return ResponseEntity.ok(traHangRepository.findHDByMa(maHD));
//    }
//
//    //Hien thi spct tra theo id
//    @GetMapping("/spct-tra")
//    public ResponseEntity<HoaDonChiTiet> findAllSPCTTra(@RequestParam("id") Integer id) {
//        Optional<HoaDonChiTiet> spct = hoaDonChiTietRepository.findById(id);
//        if (spct.isPresent()) {
//            return ResponseEntity.ok(spct.get());
//        } else {
//            return ResponseEntity.notFound().build(); // Trả về mã lỗi 404 nếu không tìm thấy
//        }
//    }
//
//    // Lấy danh sách SPCT theo idHD
//    @GetMapping("/spct/{idHD}")
//    public ResponseEntity<List<HoaDonChiTiet>> findAllSPCTByIdHd(@PathVariable("idHD") Integer idHD) {
//        List<HoaDonChiTiet> hoaDonChiTiets = traHangService.findAllByIDHoaDon(idHD);
//        return ResponseEntity.ok(hoaDonChiTiets);
//    }
//
//    // Lấy thông tin HoaDon theo idHD
//    @GetMapping("/hoa-don/{idHD}")
//    public ResponseEntity<HoaDon> findHDByIdHd(@PathVariable("idHD") Integer idHD) {
//        Optional<HoaDon> optionalHoaDon = hoaDonRepository.findById(idHD);
//        if (optionalHoaDon.isPresent()) {
//            return ResponseEntity.ok(optionalHoaDon.get());
//        } else {
//            return ResponseEntity.notFound().build(); // Không tìm thấy HoaDon
//        }
//    }
//
////    @GetMapping("/hoa-don/{idHD}")
////    public ResponseEntity<?> findAllByIdHd(@PathVariable("idHD") Integer idHD) {
////        // Lấy thông tin HoaDon theo idHD
////        Optional<HoaDon> optionalHoaDon = hoaDonRepository.findById(idHD);
////        if (!optionalHoaDon.isPresent()) {
////            return ResponseEntity.notFound().build(); // Không tìm thấy HoaDon
////        }
////
////        HoaDon hoaDon = optionalHoaDon.get();
////
////        // Lấy danh sách SPCT theo idHD
////        List<SPCT> spctList = traHangService.findAllByIDHoaDon(idHD);
////
////        return ResponseEntity.ok(new HoaDonAndSPCTResponse(hoaDon, spctList));
////    }
//
//}
