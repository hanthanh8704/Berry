package com.example.TuHocFullStack.controller;

import com.example.TuHocFullStack.entity.SPCT;
import com.example.TuHocFullStack.entity.SanPham;
import com.example.TuHocFullStack.repository.SPCT_Repository;
import com.example.TuHocFullStack.repository.SanPhamRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/chi-tiet-san-pham")
public class SPCT_Controller {
    @Autowired
    private SPCT_Repository spct_repository;

    @GetMapping("/index")
    public ResponseEntity<List<SPCT>> getAllSanPhamCT() {
        List<SPCT> SanPhamCTList = spct_repository.findAll();
        return ResponseEntity.ok(SanPhamCTList);
    }
}
