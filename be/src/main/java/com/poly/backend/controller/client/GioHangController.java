package com.poly.backend.controller.client;

import com.poly.backend.dto.client.request.GioHangChiTietRequest;
import com.poly.backend.dto.client.request.GioHangRequest;
import com.poly.backend.dto.request.diachi.DiaChiRequest;
import com.poly.backend.dto.request.hoadon.HoaDonRequest;
import com.poly.backend.dto.request.khachhang.KhachHangRequest;

import com.poly.backend.entity.English.Address;
import com.poly.backend.entity.English.Voucher;

import com.poly.backend.infrastructure.common.ResponseObject;
import com.poly.backend.service.client.GioHangService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/gio-hang")
public class GioHangController {
    @Autowired
    private GioHangService gioHangService;

    @GetMapping("/index")
    public ResponseEntity<List<GioHangChiTietRequest>> getAllGioHang(@RequestParam Integer idKH) {
        List<GioHangChiTietRequest> gioHangChiTietRequests = gioHangService.getAll(idKH);
        return ResponseEntity.ok(gioHangChiTietRequests);
    }

    @PostMapping("/create")
    public ResponseObject create(@RequestBody GioHangRequest request) {
        return gioHangService.create(request);
    }

    @PostMapping("/thanh-toan")
    public ResponseObject thanhToan(@RequestBody HoaDonRequest request) {
        return gioHangService.thanhToan(request);
    }

    @PostMapping("/mua-hang")
    public GioHangRequest muaHang(@RequestBody GioHangRequest request) {
        return gioHangService.muaHang(request);
    }

    @GetMapping("/detail/{idKH}")
    public ResponseEntity<KhachHangRequest> detail(@PathVariable("idKH") Integer idKH) {
        try {
            KhachHangRequest khachHangRequest = gioHangService.detail(idKH);
            if (khachHangRequest != null) {
                return ResponseEntity.ok(khachHangRequest);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/selected/{idDC}")
    public Address selectedDC(@PathVariable Integer idDC) {
        Address diaChi = gioHangService.selectedDiaChi(idDC);
        return diaChi;
    }

    @PutMapping("/update/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody GioHangRequest request) {
        return new ResponseObject(gioHangService.update(id, request));
    }

    @PutMapping("/update-quantity/{id}")
    public ResponseObject updateSoLuong(@PathVariable Integer id, @RequestBody GioHangRequest request) {
        return gioHangService.updateSoLuong(id, request);
    }

    @PostMapping("/createDC")
    public ResponseObject createDiaChi(@RequestBody DiaChiRequest request) {
        return gioHangService.createDiaChi(request);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseObject delete(@PathVariable("id") Integer id) {
        return gioHangService.delete(id);
    }

    @PutMapping("/update-dia-chi/{idDC}")
    public Address updateDiaChi(@PathVariable Integer idDC) {
        return gioHangService.updateDiaChiMD(idDC);
    }

    @GetMapping("/phieu-giam-gia/index")
    public ResponseEntity<List<Voucher>> getAllByPublic() {
        List<Voucher> phieuGiamGiaList = gioHangService.getAllByPublic();
        return ResponseEntity.ok(phieuGiamGiaList);
    }

    @GetMapping("/selected-voucher/{idP}")
    public Voucher selectedPhieuGiamGia(@PathVariable Integer idP) {
        Voucher phieu = gioHangService.selectedPhieuGiamGia(idP);
        return phieu;
    }

    @GetMapping("/phieu-giam-gia/detail/{idP}")
    public ResponseEntity<Voucher> detailVoucher(@PathVariable("idP") Integer idP) {
        Voucher phieuGiamGia = gioHangService.detailVoucher(idP);
        return ResponseEntity.ok(phieuGiamGia);
    }

    @GetMapping("/phieu-giam-gia/primary")
    public ResponseEntity<List<Voucher>> getAllByCaNhan(@RequestParam Integer idKH) {
        List<Voucher> phieuGiamGiaList = gioHangService.getAllByCaNhan(idKH);
        return ResponseEntity.ok(phieuGiamGiaList);
    }

    @GetMapping("/orders/{idKH}")
    public List<HoaDonRequest> getAllDonMuaByIdKh(@PathVariable Integer idKH) {
        List<HoaDonRequest> hoaDonRequests = gioHangService.getAllDonMua(idKH);
        return hoaDonRequests;
    }

}
