package com.poly.backend.controller.admin;

import com.poly.backend.entity.English.Color;
import com.poly.backend.repository.MauSacRepository;
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
@RequestMapping("/api/color")
public class MauSacController {
    @Autowired
    private MauSacRepository mauSacRepository;

    @GetMapping("/mau-sac")
    public ResponseEntity<List<Color>> getAllSanPham() {
        List<Color> kichCoList = mauSacRepository.findAll();
        return ResponseEntity.ok(kichCoList);
    }
}
