package com.poly.backend.controller.admin;

import com.poly.backend.entity.English.Brand;

import com.poly.backend.repository.ThuongHieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/brand")
public class ThuongHieuController {
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    @GetMapping("/thuong-hieu")
    public ResponseEntity<List<Brand>> getAllSanPham() {
        List<Brand> thuongHieuList = thuongHieuRepository.findAll();
        return ResponseEntity.ok(thuongHieuList);
    }

}
