package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.bill.*;
import com.example.be.dto.admin.request.bill.billcustomer.ChangeCustomerRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.entities.Bill;
import com.example.be.entities.Employee;
import com.example.be.services.BillService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.constant.StatusBill;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * @author hanthanh
 */
@RestController
@CrossOrigin("*")
@RequestMapping("api/bill")
public class BillController {
    @Autowired
    private BillService billService;

    // Hàm get all
//    @GetMapping
//    public ResponseObject getAll(BillRequest request) {
//        return new ResponseObject(billService.getAll(1, request));
//    }
//
//    @GetMapping("/status-bill")
//    public ResponseObject getAllStatusBill() {
//        return new ResponseObject(billService.getAllSatusBill());
//    }
//
//    @PutMapping("/invoice-all-pdf")
//    public ResponseObject getAllFilePdf(@RequestBody ChangAllStatusBillByIdsRequest request) {
//        return new ResponseObject(billService.createAllFilePdf(request));
//    }
//
//    @PutMapping("/change-status-bill")
//    public ResponseObject changeStatusAllBillByIds(@RequestBody ChangAllStatusBillByIdsRequest request) {
//        return new ResponseObject(billService.changeStatusAllBillByIds(request, 1));
//    }
//
//    @PutMapping("/cancel-status/{id}")
//    public ResponseObject cancelStatusBill(@PathVariable("id") Integer id, ChangStatusBillRequest request) {
//        return new ResponseObject(billService.cancelBill(id, 1, request));
//    }
//
//    @GetMapping("/details-invoices-counter")
//    public ResponseObject findAllBillAtCounterAndStatusNewBill(FindNewBillCreateAtCounterRequest request) {
//        return new ResponseObject(billService.findAllBillAtCounterAndStatusNewBill(1, request));
//    }
//
//    @GetMapping("/count-paymet-post-paid/{id}")
//    public ResponseObject countPayMentPostpaidByIdBill(@PathVariable("id") Integer id) {
//        return new ResponseObject(billService.countPayMentPostpaidByIdBill(id));
//    }
//
//    @PutMapping("/update-offline/{id}")
//    public ResponseObject updateBillOffline(@PathVariable("id") Integer id, @RequestBody UpdateBillRequest request) {
//        return new ResponseObject(billService.updateBillOffline(id, request));
//    }
//
//    @GetMapping("/code-bill")
//    public ResponseObject CreateCodeBill() {
//        return new ResponseObject(billService.CreateCodeBill(1));
//    }
//
//    @PutMapping("/roll-back-bill/{id}")
//    public ResponseObject rollBackBill(@PathVariable("id") Integer id, ChangStatusBillRequest request) {
//        return new ResponseObject(billService.rollBackBill(id, 1, request));
//    }
//
//    @PutMapping("/update-bill-wait")
//    public ResponseObject updateBillWait(@RequestBody CreateBillOfflineRequest request) {
//        return new ResponseObject(billService.updateBillWait(request));
//    }
//
//    @GetMapping("/invoice-pdf/{code}/{totalExcessMoney}")
//    public ResponseObject getFilePdf(@PathVariable("code") String code, @PathVariable("totalExcessMoney") BigDecimal totalExcessMoney) {
//        return new ResponseObject(billService.createFilePdfAtCounter(code, totalExcessMoney));
//    }
//
//    @PutMapping("/change-all-employee")
//    public ResponseObject ChangeAllEmployeeInBill(@RequestBody ChangeAllEmployeeRequest request) {
//        return new ResponseObject(billService.ChangeAllEmployee(1, request));
//    }
//
//    @PutMapping("/change-employee")
//    public ResponseObject ChangeEmployeeInBill(@RequestBody ChangeEmployeeRequest request) {
//        return new ResponseObject(billService.ChangeEmployee(1, request));
//    }
//
//    @PostMapping("/ship-bill")
//    public ResponseObject UpdateShipBill(@RequestBody BillShipRequest request) {
//        return new ResponseObject(billService.getShipBill(request));
//    }

//    @GetMapping("/give-back-information")
//    public ResponseObject BillGiveBackInformation (@RequestParam("codeBill") String codeBill){
//        return new ResponseObject(billService.getBillGiveBackInformation(codeBill));
//    }


//    @GetMapping("/give-back")
//    public ResponseObject BillGiveBack (@RequestParam("idBill") String ibBill){
//        return new ResponseObject(billService.getBillGiveBack(ibBill));
//    }


//    @PostMapping("/give-back")
//    public ResponseObject UpdateBillGiveBack (@RequestParam("updateBill") String updateBill,
//                                              @RequestParam("data") String data){
//
//        Gson gson = new Gson();
//        UpdateBillGiveBack updateBillGiveBack = gson.fromJson(updateBill, UpdateBillGiveBack.class);
//
//        JsonArray jsonData = JsonParser.parseString(data).getAsJsonArray();
//        List<UpdateBillDetailGiveBack> listDataBillDetail =  new ArrayList<>();
//        for (JsonElement dataBillDetail : jsonData) {
//            UpdateBillDetailGiveBack detail = gson.fromJson(dataBillDetail, UpdateBillDetailGiveBack.class);
//            listDataBillDetail.add(detail);
//        }
//        System.out.println(listDataBillDetail);
//        return new ResponseObject(billService.updateBillGiveBack(updateBillGiveBack, listDataBillDetail));
//    }


//    @PostMapping("/send-mail-give-back/{id}")
//    public ResponseObject sendMailGiveBack (@PathVariable("id") String id){
//        return new ResponseObject(billService.sendMailGiveBack(id));
//    }






    // Hiển thị các danh sách hóa đơn
    @GetMapping
    public PageableObject getAll(BillSearchRequest request) {
        return billService.getAll(request);
    }

    // Hàm này dùng để thống kê danh trạng thái hóa đơn
    @GetMapping("/statistic-bill-status")
    public List<CountBillStatus> getListHoaDonByTrangThai() {
        return billService.getHoaDonByTrangThai();
    }

    @GetMapping ("/new-bill")
    public List<Bill> getNewBill(BillSearchRequest request){
        return billService.getNewHoaDon(request);
    }

    // Hàm này hiển thị detail của hóa đơn
    @GetMapping("/{id}")
    public Bill getOne(@PathVariable Integer id) {
        return billService.getOne(id);
    }

    // Hàm này dùng để tạo mới một hóa đơn
    @PostMapping
    public ResponseEntity<Bill> create(@RequestBody BillRequest request) {
        return ResponseEntity.ok(billService.create());
    }


    @PostMapping("/order/{id}")
    public ResponseEntity<Bill> createOrder(@RequestBody BillRequest request) {
        return ResponseEntity.ok(billService.create());
    }
    @PutMapping("/{id}")
    public ResponseObject orderBill(@PathVariable Integer id, @RequestBody @Valid BillRequest request) {
        return new ResponseObject(billService.orderBill(id, request));
    }
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
    @PutMapping("/change-info-customer/{idHD}")
    public Bill changeInfoCustomer(@PathVariable("idHD") Integer idHD, @RequestParam Integer idNV, @RequestBody BillRequest request) {
        return billService.changeInfoCustomer(idHD, request, idNV);
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
        return  new ResponseObject(billService.updateBillWait(request));
    }
    @GetMapping("/invoice-pdf/{code}/{totalExcessMoney}")
    public ResponseObject getFilePdf(@PathVariable("code") String code, @PathVariable("totalExcessMoney") BigDecimal totalExcessMoney)  {
        return new ResponseObject(billService.createFilePdfAtCounter(code, totalExcessMoney));
    }
    @PutMapping("/invoice-all-pdf")
    public ResponseObject getAllFilePdf(@RequestBody ChangAllStatusBillByIdsRequest request)  {
        return new ResponseObject(billService.createAllFilePdf(request));
    }
}
