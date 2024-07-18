package com.example.connectdb.util.converter;


import com.example.connectdb.dto.request.material.ChatLieuRequest;
import com.example.connectdb.entity.ChatLieu;

import org.springframework.stereotype.Component;

@Component
public class MaterialConverter {
    public ChatLieu convertRequestToEntity(ChatLieuRequest request) {
        ChatLieu chatLieu = ChatLieu.builder()

                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return chatLieu;
    }

    public ChatLieu convertRequestToEntity(ChatLieu entity, ChatLieuRequest request) {

        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }
}
