package com.poly.backend.controller.admin;


import com.poly.backend.entity.English.Category;
import com.poly.backend.entity.English.Product;

import com.poly.backend.repository.DanhMucRepository;
import com.poly.backend.repository.SanPhamRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/danh-muc")
public class DanhMucController {
    @Autowired
    DanhMucRepository danhMucRepository;
    @Autowired
    SanPhamRepository sanPhamRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Category>> getAllDanhMuc() {
        List<Category> dotGiamGiaList = danhMucRepository.findAll();
        return ResponseEntity.ok(dotGiamGiaList);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<List<Product>> getDetailDM(@PathVariable("id") Integer idDM) {
        List<Product> sanPhamList = sanPhamRepository.findAllByIdDanhMuc(idDM);
        return ResponseEntity.ok(sanPhamList);
    }

}
