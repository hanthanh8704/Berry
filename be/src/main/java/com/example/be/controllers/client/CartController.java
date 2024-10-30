package com.example.be.controllers.client;

import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.dto.client.request.*;
import com.example.be.entities.Address;
import com.example.be.entities.Cart;
import com.example.be.entities.Customer;
import com.example.be.entities.Voucher;
import com.example.be.services.client.CartService;
import com.example.be.utils.common.ResponseObject;
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
public class CartController {

    private CartService gioHangService;

    @GetMapping("/index")
    public ResponseEntity<List<CartDetailRequest>> getAllGioHang(@RequestParam Integer idKH) {
        List<CartDetailRequest> gioHangChiTietRequests = gioHangService.getAll(idKH);
        return ResponseEntity.ok(gioHangChiTietRequests);
    }
    @PostMapping("/auto-create-customerLe")
    public Customer autoCreateCustomerLe() {
        return gioHangService.autoCreateCustomerLe();
    }

    @PostMapping("/create")
    public ResponseObject create(@RequestBody CartRequest request) {
        return gioHangService.create(request);
    }

    @PostMapping("/thanh-toan")
    public ResponseObject thanhToan(@RequestBody BillRequestClient request) {
        return gioHangService.thanhToan(request);
    }

    @PostMapping("/mua-hang")
    public CartRequest muaHang(@RequestBody CartRequest request) {
        return gioHangService.muaHang(request);
    }

    @GetMapping("/detail/{idKH}")
    public ResponseEntity<CustomerRequestClient> detail(@PathVariable("idKH") Integer idKH) {
        try {
            CustomerRequestClient khachHangRequest = gioHangService.detail(idKH);
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
    public ResponseObject update(@PathVariable Integer id, @RequestBody CartRequest request) {
        return new ResponseObject(gioHangService.update(id, request));
    }

    @PutMapping("/update-quantity/{id}")
    public ResponseObject updateSoLuong(@PathVariable Integer id, @RequestBody CartRequest request) {
        return gioHangService.updateSoLuong(id, request);
    }

    @PostMapping("/createDC")
    public ResponseObject createDiaChi(@RequestBody AddressRequestClient request) {
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
    public List<BillRequestClient> getAllDonMuaByIdKh(@PathVariable Integer idKH) {
        List<BillRequestClient> hoaDonRequests = gioHangService.getAllDonMua(idKH);
        return hoaDonRequests;
    }
}

