package com.example.connectdb.service;

import com.example.connectdb.dto.request.material.ChatLieuRequest;
import com.example.connectdb.dto.response.ChatLieuResponse;
import com.example.connectdb.entity.ChatLieu;
import com.example.connectdb.util.common.PageableObject;

public interface ChatLieuService {
    PageableObject<ChatLieuResponse> getAll(ChatLieuRequest request);
    ChatLieu findByMa(String ma);
    ChatLieu getOne(Integer id);

    ChatLieu create(ChatLieuRequest chatLieuRequest);

    ChatLieu update(Integer id, ChatLieuRequest chatLieuRequest);
}
