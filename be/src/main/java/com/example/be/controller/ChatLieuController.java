package com.example.be.controller;

import com.example.be.dto.request.material.ChatLieuRequest;
import com.example.be.entity.ChatLieu;
import com.example.be.repository.ChatLieuRepository;
import com.example.be.service.ChatLieuService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/material")
public class ChatLieuController {
    @Autowired
    private ChatLieuRepository chatLieuRepository;

    private final ChatLieuService chatLieuService;
    @Autowired

    public ChatLieuController(ChatLieuService chatLieuService) {
        this.chatLieuService = chatLieuService;
    }

    @GetMapping("/chat-lieu")
    public ResponseEntity<List<ChatLieu>> findAllChatLieu() {
        List<ChatLieu> kichCoList = chatLieuRepository.findAll();
        return ResponseEntity.ok(kichCoList);
    }

    @GetMapping
    public PageableObject getAll(ChatLieuRequest request) {
        return chatLieuService.getAll(request);
    }

    @GetMapping("/{id}")
    public ChatLieu getOne(@PathVariable Integer id) {
        return chatLieuService.getOne(id);
    }

    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid ChatLieuRequest request) {
        return new ResponseObject(chatLieuService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid ChatLieuRequest request) {
        return new ResponseObject(chatLieuService.update(id, request));
    }

}
