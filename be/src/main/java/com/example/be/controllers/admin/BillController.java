package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.bill.*;
import com.example.be.dto.admin.request.bill.billcustomer.ChangeCustomerRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.client.request.SelectedProductRequest;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import com.example.be.entities.Customer;
import com.example.be.entities.Employee;
import com.example.be.services.BillService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.constant.StatusBill;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author hanthanh
 */
@RestController
@CrossOrigin("*")
@RequestMapping("api/bill")
public class BillController {
    @Autowired
    private BillService billService;


    // Hiển thị các danh sách hóa đơn
    @GetMapping
    public PageableObject getAll(BillSearchRequest request) {
        return billService.getAll(request);
    }

    @GetMapping("/create/{id}")
    public boolean getOne1(@PathVariable Integer id) {
        return billService.createFilePdfAtCounter(id);
    }

    // Hàm này dùng để thống kê danh trạng thái hóa đơn
    @GetMapping("/statistic-bill-status")
    public List<CountBillStatus> getListHoaDonByTrangThai() {
        return billService.getHoaDonByTrangThai();
    }

    @GetMapping("/new-bill")
    public List<Bill> getNewBill(BillSearchRequest request) {
        return billService.getNewHoaDon(request);
    }

    // Hàm này hiển thị detail của hóa đơn
    @GetMapping("/{id}")
    public Bill getOne(@PathVariable Integer id) {
        return billService.getOne(id);
    }

    // Hàm này dùng để tạo mới một hóa đơn
//    @PostMapping
//    public ResponseEntity<Bill> create(@RequestBody BillRequest request, HttpServletRequest httpRequest) {
//        return ResponseEntity.ok(billService.create( httpRequest));
//    }
//
//
//    @PostMapping("/order/{id}")
//    public ResponseEntity<Bill> createOrder(@RequestBody BillRequest request,HttpServletRequest httpRequest) {
//        return ResponseEntity.ok(billService.create(httpRequest));
//    }

    // Hàm này dùng để tạo mới một hóa đơn
    @PostMapping
    public ResponseEntity<Bill> create(@RequestBody BillRequest request) {
        return ResponseEntity.ok(billService.create(request));
    }


//    @PostMapping("/order/{id}")
//    public ResponseEntity<Bill> createOrder(@RequestBody BillRequest request) {
//        return ResponseEntity.ok(billService.create( request));
//    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> orderBill(
            @PathVariable Integer id,
            @RequestBody @Valid BillRequest request) {
//        try {
            // Gọi service để xử lý logic đặt hàng
            Object result = billService.orderBill(id, request);
            return ResponseEntity.ok(new ResponseObject(result));
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    Map.of(
//                            "success", false,
//                            "message", e.getMessage()
//                    )
//            );
//        } catch (Exception e) {
//            // Xử lý các lỗi không mong muốn
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    Map.of(
//                            "success", false,
//                            "message", "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
//                    )
//            );
//        }
    }

//    @PutMapping("/{id}")
//    public ResponseObject orderBill(@PathVariable Integer id, @RequestBody @Valid BillRequest request) {
//        return new ResponseObject(billService.orderBill(id, request));
//    }

    @PutMapping("/change-status")
    public ResponseObject changeStatus(@RequestBody ChangAllStatusBillByIdsRequest request,
                                       @RequestParam(required = false) Integer idNhanVien) {
        return new ResponseObject(billService.changeStatus(request, idNhanVien));
    }

    // Hàm này dùng để hủy hóa đơn
    @PutMapping("/cancel-status/{idHD}")
    public ResponseObject changeStatusCancelBill(@PathVariable("idHD") Integer idHD, @RequestParam Integer idNhanVien, @RequestBody CancelBillClientRequest request) {
        return new ResponseObject(billService.changeStatusCancelBill(idHD, idNhanVien, request));
    }

    // Hàm này dùng để quay laị trạng thái của hóa đơn
    @PutMapping("/roll-back-bill/{id}")
    public ResponseObject rollBackBill(@PathVariable("id") Integer idHD, @RequestBody ChangStatusBillRequest request) {
        return new ResponseObject(billService.rollBackBill(idHD, 1, request));
    }

    //Hàm lày dùng để lấy ra thôgn tin khach hang va dia chi cuar nos
    @GetMapping("/detail-info-customer/{idHD}")
    public ChangeCustomerRequest DetailInfoCustomer(@PathVariable("idHD") Integer idHD) {
        return billService.detailInfoCustomer(idHD);
    }

    //Hàm lày dùng để thay đổi thông tin khách hàng trong hóa đơn  và địa chir của nó trong hóa đơn
    @PutMapping("/change-info-customer/{idHD}/{idNV}")
    public Bill changeInfoCustomer(@PathVariable("idHD") Integer idHD, @PathVariable("idNV") Integer idNV, @RequestBody BillRequest customer) {
        return billService.changeInfoCustomer(idHD, idNV, customer);
    }

    @PutMapping("/quantity/{id}/{nv}")
    public ResponseEntity<?> change(@PathVariable("id") Integer id,@PathVariable("nv") Integer nv ) {
        try {
            // Gọi service để thay đổi số lượng và trả về kết quả
            ResponseObject responseObject = new ResponseObject(billService.changeQuantity(id,nv));
            return ResponseEntity.ok(responseObject);
        } catch (RuntimeException e) {
            // Xử lý các lỗi từ logic nghiệp vụ (RuntimeException)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        } catch (Exception e) {
            // Xử lý các lỗi hệ thống không mong muốn
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "success", false,
                            "message", "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
                    )
            );
        }
    }



    //Hàm lày dùng để lấy ra tất cả nhân viên

    @GetMapping("/get-all-employee")
    public List<Employee> getAllEmployee() {
        return billService.getAllEmployee();
    }

    //Hàm thay đổi nhaan vieen tieeps nhan trong hóa đơn
    @PutMapping("/change-employee")
    public ResponseObject ChangeEmployee(@RequestParam Integer idNV, @RequestBody ChangeEmployeeRequest request) {
        return new ResponseObject(billService.changeEmployee(idNV, request));
    }

    @PutMapping("/update-bill-wait")
    public ResponseObject updateBillWait(@RequestBody BillRequest request) {
        return new ResponseObject(billService.updateBillWait(request));
    }

    @GetMapping("/invoice-pdf/{code}/{totalExcessMoney}")
    public ResponseObject getFilePdf(@PathVariable("code") String code, @PathVariable("totalExcessMoney") BigDecimal totalExcessMoney) {
        return new ResponseObject(billService.createFilePdfAtCounter(code, totalExcessMoney));
    }

    // Xác nhận đơn hàng bên admin va van chuyen ben giao hang
    @GetMapping("/invoice-pdf-client/{code}/{totalExcessMoney}")
    public ResponseObject getFilePdfClient_Order(@PathVariable("code") String code, @PathVariable("totalExcessMoney") BigDecimal totalExcessMoney) {
        return new ResponseObject(billService.createFilePdfAtCounter(code, totalExcessMoney));
    }

    @PutMapping("/invoice-all-pdf")
    public ResponseObject getAllFilePdf(@RequestBody ChangAllStatusBillByIdsRequest request) {
        return new ResponseObject(billService.createAllFilePdf(request));
    }


    @DeleteMapping("/{id}")
    public ResponseObject getDeleted(@PathVariable Integer id) {
        return new ResponseObject(billService.deleted(id));
    }


    // Hàm nay cua duc
    @GetMapping("/request-cancel-bill")
    public PageableObject GetAllDonYeuCauHuy(BillSearchRequest request) {
        return billService.getAllDonYeuCauHuy(request);
    }


}
