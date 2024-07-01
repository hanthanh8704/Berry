package com.example.be.controller;

import com.example.be.dto.request.customer.KhachHangRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.entity.KhachHang;
import com.example.be.service.KhachHangService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class KhachHangController {
    @Autowired
    private KhachHangService accountService;

    @GetMapping
    public PageableObject<KhachHangResponse> getAll(KhachHangRequest request) {
        return accountService.getAll(request);
    }

    @GetMapping("/{id}")
    public KhachHang getOne(@PathVariable Integer id) {
        return accountService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@ModelAttribute @Valid KhachHangRequest request) {
        return new ResponseObject(accountService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id,
                                 @ModelAttribute @Valid KhachHangRequest request) {
        return new ResponseObject(accountService.update(id, request));
    }
}
