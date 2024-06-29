package com.example.be.controller;

import com.example.be.dto.request.KhachHang.KhachHangRequest;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.service.PhieuGiamGiaService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/voucher")
public class PhieuGiamGiaController {
    @Autowired
    private PhieuGiamGiaService voucherService;

    @GetMapping("/private/{id}")
    public ResponseObject getAccountVoucher(@PathVariable Integer id, PhieuGiamGiaRequest request){
        return new ResponseObject(voucherService.getAccountVoucher(id,request));
    }

    @GetMapping("/public")
    public ResponseObject getPublicVoucher(PhieuGiamGiaRequest request){
        return new ResponseObject(voucherService.getPublicVoucher(request));
    }

    @GetMapping
    public PageableObject getAll(final PhieuGiamGiaRequest request) {
        return voucherService.getAll(request);
    }

    @GetMapping("khach-hang")
    public PageableObject getAllKhachHang(final KhachHangRequest request) {
        return voucherService.findKhachHang(request);
    }

    @PostMapping("/add")
    public ResponseObject addVoucher(@RequestBody @Valid PhieuGiamGiaRequest request) {
        return new ResponseObject(voucherService.add(request));

    }

    @PutMapping("/update/{id}")
    public ResponseObject updateVocher(@RequestBody @Valid PhieuGiamGiaRequest request, @PathVariable Integer id) {
        return new ResponseObject(voucherService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhieuGiamGiaResponse> getOne(@PathVariable Integer id) {
        return new ResponseEntity<>(voucherService.getOne(id), HttpStatus.OK);
    }
    @GetMapping("/edit/{id}")
    public PhieuGiamGiaResponse edit(@PathVariable Integer id) {
        return voucherService.edit(id);
    }
    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate( @PathVariable Integer id) {
        return new ResponseObject(voucherService.updateEndDate(id));
    }
}
