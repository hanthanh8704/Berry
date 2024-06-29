package com.example.connectdb.controller;

import com.example.connectdb.dto.request.material.ChatLieuRequest;
import com.example.connectdb.entity.ChatLieu;
import com.example.connectdb.service.ChatLieuService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/material")
public class ChatLieuController {
    private final ChatLieuService chatLieuService;

    @Autowired
    public ChatLieuController(ChatLieuService chatLieuService) {
        this.chatLieuService = chatLieuService;
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
