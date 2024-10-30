package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.BillDetail;
import com.example.be.services.BillDetailService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("api/bill-detail")
public class BillDetailController {
    private final BillDetailService hoaDonChiTietService;
    @Autowired
    public BillDetailController(BillDetailService hoaDonChiTietService) {
        this.hoaDonChiTietService = hoaDonChiTietService;
    }

    //Duoc roi
    @GetMapping
    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
        return hoaDonChiTietService.getAll(request);
    }

    @GetMapping("/{id}")
    public BillDetail getOne(@PathVariable Integer id) {
        return hoaDonChiTietService.getOne(id);
    }

    // Hàm này dùng để lấy ra danh sách hóa đơn chi tiết theo id hóa đơn
    @GetMapping("/bill/{idBill}")
    public List<BillDetail> findByHoaDonId(@PathVariable Integer idHoaDon) {
        return hoaDonChiTietService.findByHoaDonId(idHoaDon);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(hoaDonChiTietService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(hoaDonChiTietService.update(id, request));
    }

    @GetMapping("/update-quantity/{id}")
    public ResponseObject updateQuantity(@PathVariable Integer id, @RequestParam(required = false, defaultValue = "0") Integer newQuantity, @RequestParam(value = "donGia", required = true) BigDecimal donGia) {
        return new ResponseObject(hoaDonChiTietService.updateSoLuong(id, newQuantity, donGia));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Integer id){
        return new ResponseObject(hoaDonChiTietService.delete(id));
    }
}
