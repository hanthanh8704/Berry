package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.BillDetail;
import com.example.be.services.BillDetailService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> create(@RequestBody @Valid BillDetailRequest request) {
//        try {
            // Process creating a detailed bill
            BillDetail createdBillDetail = hoaDonChiTietService.create(request);

            // Return a successful response
            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "data", createdBillDetail
                    )
            );
//        } catch (RuntimeException e) {
//            // Return error message from exception
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    Map.of(
//                            "success", false,
//                            "message", e.getMessage()
//                    )
//            );
//        }
    }



    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(hoaDonChiTietService.update(id, request));
    }

    @GetMapping("/update-quantity/{id}")
    public ResponseEntity<Object> updateQuantity(
            @PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "0") Integer newQuantity,
            @RequestParam(value = "donGia", required = true) BigDecimal donGia) {
        try {
            // Thực hiện cập nhật số lượng
            Object result = hoaDonChiTietService.updateSoLuong(id, newQuantity, donGia);
            return ResponseEntity.ok(new ResponseObject(result));
        } catch (RuntimeException e) {
            // Trả lỗi với thông điệp rõ ràng
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        } catch (Exception e) {
            // Xử lý các lỗi không mong muốn
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "success", false,
                            "message", "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
                    )
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Integer id){
        return new ResponseObject(hoaDonChiTietService.delete(id));
    }



    //Cua Duc lam
    @PostMapping("/create")
    public BillDetail createBillDetail(@RequestBody @Valid BillDetailRequest request, @RequestParam("idNhanVien") Integer idNhanVien) {
        BillDetail createdBillDetail = hoaDonChiTietService.createBillDetail(request, idNhanVien);
        return createdBillDetail;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseObject deleteBillDetail(@PathVariable("id") Integer idHDCT, @RequestParam("idNhanVien") Integer idNhanVien) {
        return new ResponseObject(hoaDonChiTietService.deleteBillDetail(idHDCT, idNhanVien));
    }

    @PutMapping("/update-quantity-bill-detail/{id}")
    public BillDetail updateQuantityBillDetail(
            @PathVariable Integer id,
            @RequestParam(value = "newQuantity") Integer newQuantity,
            @RequestParam(value = "idNhanVien") Integer idNhanVien) {

        BillDetail billDetail = hoaDonChiTietService.updateSoLuongBillDetail(id, newQuantity, idNhanVien);
        return billDetail;
    }
}
