package com.poly.backend.controller.admin;

import com.poly.backend.entity.English.Size;

import com.poly.backend.repository.KichCoRepository;
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
@RequestMapping("/api/size")
public class KichCoController {
    @Autowired
    private KichCoRepository kichCoRepository;
    @GetMapping("/kich-co")
    public ResponseEntity<List<Size>> getAllSanPham() {
        List<Size> kichCoList = kichCoRepository.findAll();
        return ResponseEntity.ok(kichCoList);
    }
}
