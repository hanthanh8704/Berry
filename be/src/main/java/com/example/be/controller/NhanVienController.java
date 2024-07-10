package com.example.be.controller;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import com.example.be.service.NhanVienService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/nhan-vien")
public class NhanVienController {
    @Autowired
    private NhanVienService nhanVienService;

    private static String vaiTro ="Nhân viên";
    @GetMapping
    public PageableObject<NhanVienResponse> getAll(NhanVienRequest request) {
        return nhanVienService.getAll(request);
    }

    // Ham them Nhan vien vao REST API
    @PostMapping("/create")
    public ResponseObject createNhanVien(@RequestBody NhanVienRequest nhanvienRequest) {
        NhanVien savedNhanVien = nhanVienService.createNhanVien(nhanvienRequest,vaiTro);
        return new ResponseObject(savedNhanVien);
    }

    @PutMapping("/update/{id}")
    public ResponseObject updateNhanVien(@RequestBody @Valid NhanVienRequest request, @PathVariable Integer id) {
        return new ResponseObject(nhanVienService.update(id,request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<NhanVienResponse> getNhanVien(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(nhanVienService.getOne(id), HttpStatus.OK);
    }
}
