package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.request.voucher.VoucherRequest;
import com.example.be.dto.admin.response.voucher.VoucherResponse;
import com.example.be.services.VoucherService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voucher")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping("/private/{id}")
    public ResponseObject getAccountVoucher(@PathVariable Integer id, VoucherRequest request){
        return new ResponseObject(voucherService.getAccountVoucher(id,request));
    }

    @GetMapping("/public")
    public ResponseObject getPublicVoucher(VoucherRequest request){
        return new ResponseObject(voucherService.getPublicVoucher(request));
    }

    @GetMapping
    public PageableObject getAll(final VoucherRequest request) {
        return voucherService.getAll(request);
    }

    @GetMapping("customer")
    public PageableObject getAllKhachHang(final CustomerRequest request) {
        return voucherService.findCustomer(request);
    }
    @GetMapping("customer/{id}")
    public PageableObject getAllKhachHangIdPGG(@PathVariable("id") Integer id,final CustomerRequest request) {
        return voucherService.findVoucherCustomer(id,request);
    }

    @PostMapping("/add")
    public ResponseObject addVoucher(@RequestBody @Valid VoucherRequest request) {
        return new ResponseObject(voucherService.add(request));
    }

    @PutMapping("/update/{id}")
    public ResponseObject updateVocher(@RequestBody @Valid VoucherRequest request, @PathVariable Integer id) {
        return new ResponseObject(voucherService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getVoucher(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(voucherService.getOne(id), HttpStatus.OK);
    }


    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate( @PathVariable Integer id) {
        return new ResponseObject(voucherService.updateEndDate(id));
    }
}