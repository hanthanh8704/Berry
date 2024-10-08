package com.poly.backend.controller.admin;


import com.poly.backend.entity.English.Material;

import com.poly.backend.repository.ChatLieuRepository;
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
@RequestMapping("/api/material")
public class ChatLieuController {
    @Autowired
    private ChatLieuRepository chatLieuRepository;

    @GetMapping("chat-lieu")
    public ResponseEntity<List<Material>> getAllSanPham() {
        List<Material> kichCoList = chatLieuRepository.findAll();
        return ResponseEntity.ok(kichCoList);
    }
}
