package com.example.be.service;


import com.example.be.dto.request.material.ChatLieuRequest;
import com.example.be.dto.response.ChatLieuResponse;
import com.example.be.entity.ChatLieu;
import com.example.be.util.common.PageableObject;

public interface ChatLieuService {
    PageableObject<ChatLieuResponse> getAll(ChatLieuRequest request);

    ChatLieu getOne(Integer id);

    ChatLieu create(ChatLieuRequest chatLieuRequest);

    ChatLieu update(Integer id, ChatLieuRequest chatLieuRequest);
}
