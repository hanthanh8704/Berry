package com.example.be.controllers.client;

import com.example.be.dto.admin.request.bill.BillRequest;
import com.example.be.dto.admin.request.bill.CancelBillClientRequest;
import com.example.be.dto.client.request.BillRequestClient;
import com.example.be.dto.client.request.SelectedProductRequest;
import com.example.be.entities.Bill;
import com.example.be.services.client.TrackingService;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.exception.RestApiException;
import lombok.AllArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/tra-cuu")
public class TrackingController {
    private TrackingService traCuuService;

    @GetMapping("detail/{code}")
    public BillRequestClient detailHoaDon(@PathVariable String code) {  // Đổi từ idDC thành idHD
        BillRequestClient hoaDonRequest = traCuuService.detailHoaDon(code);
        return hoaDonRequest;
    }

    @GetMapping("hoa-don")
    public Bill findByMaAndSDT(@RequestParam String code, @RequestParam String recipientPhone) {
        Bill hoaDon = traCuuService.findByMaAndSDT(code, recipientPhone);
        return hoaDon;
    }
    // Hàm này dùng để yêu  hủy hóa đơn


    @PutMapping("/cancel-status/{idHD}")
    public ResponseObject changeStatusCancelBill(@PathVariable("idHD") Integer idHD, @RequestBody CancelBillClientRequest request) {
        // Thực hiện logic cập nhật trạng thái
        return new ResponseObject(traCuuService.changeStatusCancelBill(idHD, request));
    }

    @PostMapping("/selected-product")
    public ResponseEntity<ResponseObject> selectedProductDetail(@RequestBody SelectedProductRequest request) {
        try {
            // Lấy thông tin từ request body
            return ResponseEntity.ok(new ResponseObject(traCuuService.selectedProductDetail(request.getBillDetailRequest(), request.getSanPhamMoi())));
        } catch (RestApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseObject(e.getMessage()));
        }
    }

    @PostMapping("/reset-order")
    public ResponseEntity<ResponseObject> reSetOrder(@RequestBody SelectedProductRequest request) {

        // Gọi service để thực hiện thêm các sản phẩm vào hóa đơn
        boolean success = traCuuService.reSetOrder(request.getBillRequest(), request.getSanPhamMoi());
        // Kiểm tra kết quả và trả về phản hồi
        if (success) {
            return ResponseEntity.ok(new ResponseObject("Thêm sản phẩm vào hóa đơn thành công"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseObject("Thêm sản phẩm vào hóa đơn thất bại"));
        }

    }

    //Hàm update điaj chỉ
    @PostMapping("/update-address")
    public ResponseEntity<Bill> updateDiaChi(@RequestBody BillRequest request) {
        Bill updatedBill = traCuuService.updateDiaChi(request);
        return ResponseEntity.ok(updatedBill);
    }

}
