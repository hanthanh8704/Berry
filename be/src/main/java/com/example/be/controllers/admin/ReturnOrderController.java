package com.example.be.controllers.admin;


import com.example.be.dto.admin.request.billgiveback.ChangAllStatusBillGiveBackIdsRequest;
import com.example.be.dto.admin.request.billgiveback.UpdateBillDetailGiveBack;
import com.example.be.dto.admin.request.billgiveback.UpdateBillGiveBack;
import com.example.be.entities.ReturnOrder;
import com.example.be.services.ReturnOrderService;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.exception.RestApiException;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/return-order")
public class ReturnOrderController {
    @Autowired
    ReturnOrderService returnOrderService;

    @GetMapping("/information")
    public ResponseEntity<ResponseObject> BillGiveBackInformation(@RequestParam("codeBill") String codeBill) {
        try {
            return ResponseEntity.ok(new ResponseObject(returnOrderService.getBillGiveBackInformation(codeBill)));
        } catch (RestApiException e) {
            // Xử lý lỗi và trả về thông báo lỗi từ chính controller này
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseObject(e.getMessage()));
        }
    }

    @GetMapping("/{idBill}")
    public ReturnOrder detail(@PathVariable("idBill") Integer ibBill) {
        return returnOrderService.findByIdBill(ibBill);
    }

    @GetMapping()
    public ResponseObject BillGiveBack(@RequestParam("idBill") Integer ibBill) {
        return new ResponseObject(returnOrderService.getBillGiveBack(ibBill));
    }


    @PostMapping("/give-back")
    public ResponseObject UpdateBillGiveBack(@RequestParam("idNhanVien") Integer idNhanVien, @RequestParam("updateBill") String updateBill,
                                             @RequestParam("data") String data) {

        Gson gson = new Gson(); //Tạo một đối tượng Gson để xử lý chuyển đổi dữ liệu JSON.
        UpdateBillGiveBack updateBillGiveBack = gson.fromJson(updateBill, UpdateBillGiveBack.class);// Chuyển đổi chuỗi JSON updateBill thành một đối tượng UpdateBillGiveBack.

        JsonArray jsonData = JsonParser.parseString(data).getAsJsonArray(); // Phân tích chuỗi data thành JsonArray

        List<UpdateBillDetailGiveBack> listDataBillDetail = new ArrayList<>();
        for (JsonElement dataBillDetail : jsonData) {
            UpdateBillDetailGiveBack detail = gson.fromJson(dataBillDetail, UpdateBillDetailGiveBack.class);
            listDataBillDetail.add(detail);
        }
        System.out.println(listDataBillDetail);
        return new ResponseObject(returnOrderService.updateBillGiveBack(idNhanVien, updateBillGiveBack, listDataBillDetail));
    }

    @Value("${pdf.storage.path}") // Đường dẫn đến thư mục lưu trữ file PDF
    private String pdfStoragePath;

    @GetMapping("/pdf/{fileName}")
    public ResponseEntity<Resource> getPdf(@PathVariable String fileName) {
        try {
            File pdfFile = new File(pdfStoragePath + fileName);
            if (pdfFile.exists()) {
                Resource resource = new FileSystemResource(pdfFile);
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + fileName);
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/invoice-all-pdf")
    public ResponseObject getAllFilePdf(@RequestBody ChangAllStatusBillGiveBackIdsRequest request) {
        return new ResponseObject(returnOrderService.createAllFilePdf(request));
    }


}
