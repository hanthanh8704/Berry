package com.example.be.controller;

import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.service.PhieuGiamGiaService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("khach-hang/{id}")
    public PageableObject getAllKhachHangIdPGG(@PathVariable("id") Integer id,final KhachHangRequest request) {
        return voucherService.findKhachHangIdPGG(id,request);
    }

    @PostMapping("/add")
    public ResponseObject addVoucher(@RequestBody @Valid PhieuGiamGiaRequest request) {
        return new ResponseObject(voucherService.add(request));
    }

    @PutMapping("/update/{id}")
    public ResponseObject updateVocher(@RequestBody @Valid PhieuGiamGiaRequest request, @PathVariable Integer id) {
//        return new ResponseObject(voucherService.update(id, request));
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhieuGiamGiaResponse> getVoucher(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(voucherService.getOne(id), HttpStatus.OK);
    }


    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate( @PathVariable Integer id) {
        return new ResponseObject(voucherService.updateEndDate(id));
    }
}
