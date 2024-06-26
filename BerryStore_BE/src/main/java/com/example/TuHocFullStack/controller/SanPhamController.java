package com.example.TuHocFullStack.controller;

import com.example.TuHocFullStack.entity.DotGiamGia;
import com.example.TuHocFullStack.entity.SanPham;
import com.example.TuHocFullStack.repository.SanPhamRepository;
import com.example.TuHocFullStack.service.DotGiamGiaService;
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
@RequestMapping("/api/san-pham")
public class SanPhamController {
    @Autowired
    private SanPhamRepository sanPhamRepository;

    @GetMapping("/index")
    public ResponseEntity<List<SanPham>> getAllSanPham() {
        List<SanPham> SanPhamList = sanPhamRepository.findAll();
        return ResponseEntity.ok(SanPhamList);
    }
}
